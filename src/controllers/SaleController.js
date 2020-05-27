import { Firestore } from '../server/firebase';
import FormatSale from '../helpers/FormatSale';
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

          Firestore.collection(COL_SALES)
            .doc(sale.id)
            .collection(SUBCOL_SALE_PRODUCTS)
            .get()
            .then(snapshot1 => {
              snapshot1.forEach(product => {
                sale.products.push(product.data());
              });

              sales.push(FormatSale(sale));
            });
        });
      });

    return sales;
  },

  update(sale) {
    const query = Firestore.collection(COL_SALES).doc(sale.id);

    const s = Object.assign(sale);
    delete s.id;
    delete s.situation;

    return query.update(s);
  },
};

export default SaleController;
