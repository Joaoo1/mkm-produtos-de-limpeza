import { Firestore } from '../server/firebase';
import { COL_PRODUCTS, SUBCOL_STOCK_HISTORY } from '../constants/firestore';
import Product from '../models/Product';
import StockHistoryController from './StockHistoryController';

const ProductController = {
  async index() {
    const data = await Firestore.collection(COL_PRODUCTS)
      .orderBy('nome', 'asc')
      .get();
    const products = data.docs.map(doc => {
      const product = new Product({ ...doc.data(), id: doc.id });
      product.formatFromFirestore();
      return product;
    });

    return products;
  },
  create(product) {
    const p = new Product(product);
    p.formatToFirestore();
    return Firestore.collection(COL_PRODUCTS).add({ ...p });
  },

  update(product) {
    const p = new Product(product);
    p.formatToFirestore();
    return StockHistoryController.update({ ...p, id: product.id }).then(() => {
      return Firestore.collection(COL_PRODUCTS)
        .doc(product.id)
        .update({ ...p });
    });
  },

  delete(id) {
    const docRef = Firestore.collection(COL_PRODUCTS).doc(id);
    docRef
      .collection(SUBCOL_STOCK_HISTORY)
      .get()
      .then(snapshot =>
        snapshot.docs.map(stockHistory => stockHistory.ref.delete())
      );
    return docRef.delete();
  },
};

export default ProductController;
