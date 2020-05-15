import { Firestore } from '../server/firebase';
import { COL_SALES, SUBCOL_SALE_PRODUCTS } from '../constants/firestore';

const SaleProductController = {
  index(s) {
    const sales = [];
    s.forEach(sale => {
      sale.products = [];
      Firestore.collection(COL_SALES)
        .doc(sale.id)
        .collection(SUBCOL_SALE_PRODUCTS)
        .get()
        .then(snapshot => {
          snapshot.forEach(productData => {
            const product = productData.data();
            product.id = productData.id;
            sale.products.push(product);
          });
          sales.push(sale);
        });
    });

    return sales;
  },
};

export default SaleProductController;
