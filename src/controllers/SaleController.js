import firebase from 'firebase';
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

  update(sale, isFinishSale) {
    if (isFinishSale) {
      const finish = firebase.functions().httpsCallable('finishSale');
      return finish(sale);
    }

    return Firestore.collection('vendas').doc(sale.id).update(sale);
  },
};

export default SaleController;
