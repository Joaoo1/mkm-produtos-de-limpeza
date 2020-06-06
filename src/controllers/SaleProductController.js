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

  create(saleId, products) {
    const promises = products.map(product => {
      product.preco = product.preco.toFixed(2);
      return Firestore.collection(COL_SALES)
        .doc(saleId)
        .collection(SUBCOL_SALE_PRODUCTS)
        .add(product);
    });

    return Promise.all([...promises]);
  },
};

export default SaleProductController;
