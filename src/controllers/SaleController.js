import firebase from 'firebase';
import { Firestore } from '../server/firebase';
import Sale from '../models/Sale';
import { COL_SALES, SUBCOL_SALE_PRODUCTS } from '../constants/firestore';
import { convertStringToTimeStamp } from '../helpers/FormatDate';

const SaleController = {
  index() {
    const sales = [];
    Firestore.collection(COL_SALES)
      .get()
      .then(response => {
        response.docs.forEach(snapshot => {
          const sale = snapshot.data();
          sale.id = snapshot.id;
          sale.products = [];

          Firestore.collection(COL_SALES)
            .doc(sale.id)
            .collection(SUBCOL_SALE_PRODUCTS)
            .get()
            .then(snapshot1 => {
              snapshot1.forEach(product => {
                sale.products.push(product.data());
              });
              sales.push(new Sale(sale));
            });
        });
      });

    return sales;
  },

  create(sale) {
    const newSale = {};
    newSale.dataVenda = new Date();
    newSale.idVenda = 9999;
    newSale.pago = sale.paymentMethod === 'paid';
    newSale.valorBruto = sale.totalProducts.toFixed(2);
    newSale.valorPago = sale.totalPaid.toFixed(2);
    newSale.desconto = sale.discount.toFixed(2);
    newSale.valorLiquido = sale.totalProducts.sub(sale.discount).toFixed(2);
    newSale.valorAReceber = sale.total.sub(sale.totalPaid).toFixed(2);
    newSale.nomeCliente = sale.client.nome;
    if (sale.seller) newSale.seller = sale.seller;
    if (sale.sellerUid) newSale.sellerUid = sale.sellerUid;
    if (!newSale.pago) {
      newSale.enderecoCliente = sale.client.endereco;
      newSale.complementoCliente = sale.client.complemento;
      newSale.bairroCliente = sale.client.bairro;
      newSale.cidadeCliente = sale.client.cidade;
      newSale.telefone = sale.client.telefone;
    }

    return Firestore.collection(COL_SALES).add(newSale);
  },

  update(sale, isFinishSale) {
    if (isFinishSale) {
      const finish = firebase.functions().httpsCallable('finishSale');
      return finish({
        ...sale,
        dataVenda: convertStringToTimeStamp(sale.dataVenda),
      });
    }

    return Firestore.collection('vendas')
      .doc(sale.id)
      .update({ ...sale, dataVenda: convertStringToTimeStamp(sale.dataVenda) });
  },
};

export default SaleController;
