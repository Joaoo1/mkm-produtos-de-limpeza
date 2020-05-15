import { Firestore } from '../server/firebase';
// import SaleProductController from './SaleProductController';
import { COL_SALES, SUBCOL_SALE_PRODUCTS } from '../constants/firestore';

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

          // Converting timestamp to date
          const date = sale.dataVenda.toDate();
          const FormattedDate = Intl.DateTimeFormat('pt-BR').format(date);
          sale.dataVenda = FormattedDate;

          if (sale.pago) {
            sale.situation = 'PAGO';
          } else if (parseInt(sale.valorPago, 10) > 0) {
            sale.situation = 'PARCIALMENTE PAGO';
          } else {
            sale.situation = 'NÃO PAGO';
          }

          Firestore.collection(COL_SALES)
            .doc(sale.id)
            .collection(SUBCOL_SALE_PRODUCTS)
            .get()
            .then(snapshot1 => {
              snapshot1.forEach(product => {
                sale.products.push(product.data());
              });
              sales.push(sale);
            });
        });
      });

    return sales;
  },
};

export default SaleController;
