import { Firestore, Functions } from '../server/firebase';
import Sale from '../models/Sale';
import {
  COL_SALES,
  SUBCOL_SALE_PRODUCTS,
  COL_SALE_IDS,
} from '../constants/firestore';
import { convertStringToTimeStamp } from '../helpers/FormatDate';

const SaleController = {
  index(limit) {
    function getProductsBySaleId(saleId) {
      const products = [];
      return Firestore.collection(COL_SALES)
        .doc(saleId)
        .collection(SUBCOL_SALE_PRODUCTS)
        .get()
        .then(productsData => {
          productsData.forEach(doc => {
            const product = doc.data();
            product.id = doc.id;
            products.push(product);
          });

          return products;
        });
    }
    let query = Firestore.collection(COL_SALES).orderBy('dataVenda', 'desc');
    if (limit && !Number.isNaN(limit)) query = query.limit(limit);
    return query.get().then(salesData => {
      const sales = [];
      return Promise.all(
        salesData.docs.map(doc => {
          const sale = doc.data();
          sale.id = doc.id;
          const productsPromise = getProductsBySaleId(sale.id);
          return productsPromise.then(products => {
            const saleWithProducts = new Sale(sale);
            saleWithProducts.products = products;
            sales.push(saleWithProducts);
            return sales;
          });
        })
      ).then(
        sales => (sales.length > 0 ? sales[0] : []),
        () => []
      );
    });
  },

  create(sale) {
    // First get a available ID for then register sale in firestore
    function createSale(idVenda) {
      const newSale = {};
      newSale.dataVenda = new Date();
      newSale.idVenda = idVenda;
      newSale.pago = sale.paymentMethod === 'paid';
      newSale.valorBruto = sale.totalProducts.toFixed(2);
      newSale.valorPago = sale.totalPaid.toFixed(2);
      newSale.desconto = sale.discount.toFixed(2);
      newSale.valorLiquido = sale.totalProducts.sub(sale.discount).toFixed(2);
      newSale.valorAReceber = sale.total.sub(sale.totalPaid).toFixed(2);
      newSale.idCliente = sale.client.id;
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
      Firestore.collection(COL_SALE_IDS).add({ venda: idVenda });
      return Firestore.collection(COL_SALES).add(newSale);
    }
    // Generate a ID for sale that has not been used
    return Firestore.collection(COL_SALE_IDS)
      .get()
      .then(data => {
        // Get all IDS that has already been used
        const usedIds = data.docs.map(snapshot => {
          const id = snapshot.data();
          return id.venda;
        });
        // The generate ID must to be between 1k and 10k
        for (let i = 1000; i < 10000; i++) {
          if (!usedIds.includes(i)) {
            // A valid ID was found, now format sale and create it
            return createSale(i);
          }
        }

        return Promise.reject();
      });
  },

  async update(sale, isFinishSale) {
    if (isFinishSale) {
      const finish = Functions.httpsCallable('finishSale');
      return finish({
        ...sale,
        dataVenda: convertStringToTimeStamp(sale.dataVenda),
        valorBruto: sale.valorBruto.toFixed(2),
        valorPago: sale.valorPago.toFixed(2),
        desconto: sale.desconto.toFixed(2),
        valorLiquido: sale.valorLiquido.toFixed(2),
        valorAReceber: sale.valorAReceber.toFixed(2),
      });
    }
    const newSale = {};
    newSale.idVenda = sale.idVenda;
    newSale.pago = sale.paymentMethod === 'paid';
    newSale.valorBruto = sale.totalProducts.toFixed(2);
    newSale.valorPago = sale.totalPaid.toFixed(2);
    newSale.desconto = sale.discount.toFixed(2);
    newSale.valorLiquido = sale.totalProducts.sub(sale.discount).toFixed(2);
    newSale.valorAReceber = sale.total.sub(sale.totalPaid).toFixed(2);
    newSale.idCliente = sale.client.idCliente;
    newSale.nomeCliente = sale.client.nomeCliente;
    if (sale.seller) newSale.seller = sale.seller;
    if (sale.sellerUid) newSale.sellerUid = sale.sellerUid;
    if (!newSale.pago) {
      if (newSale.enderecoCliente)
        newSale.enderecoCliente = sale.enderecoCliente;
      if (newSale.complementoCliente)
        newSale.complementoCliente = sale.complementoCliente;
      if (newSale.bairroCliente) newSale.bairroCliente = sale.bairroCliente;
      if (newSale.cidadeCliente) newSale.cidadeCliente = sale.cidadeCliente;
      if (newSale.telefone) newSale.telefone = sale.telefone;
    }

    return Firestore.collection('vendas')
      .doc(sale.id)
      .update({
        ...newSale,
        dataVenda: convertStringToTimeStamp(sale.dataVenda),
      });
  },

  delete(saleId, idVenda) {
    Firestore.collection(COL_SALES)
      .doc(saleId)
      .collection(SUBCOL_SALE_PRODUCTS)
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(sale => sale.ref.delete());
      });

    Firestore.collection(COL_SALE_IDS)
      .where('venda', '==', idVenda)
      .get()
      .then(snapshot => snapshot.docs[0].ref.delete());

    return Firestore.collection(COL_SALES).doc(saleId).delete();
  },
};

export default SaleController;
