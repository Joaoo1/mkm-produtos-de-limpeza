import { Firestore } from '../server/firebase';
import { COL_PRODUCTS, SUBCOL_STOCK_HISTORY } from '../constants/firestore';
import Product from '../models/Product';
import ProductFirestore from '../models/ProductFirestore';
import StockHistoryController from './StockHistoryController';

const ProductController = {
  async index() {
    const data = await Firestore.collection(COL_PRODUCTS)
      .orderBy('nome', 'asc')
      .get();
    const products = data.docs.map(doc => {
      const product = new Product({ ...doc.data(), id: doc.id });
      return product;
    });

    return products;
  },

  create(newProduct) {
    const product = new ProductFirestore(newProduct);
    return Firestore.collection(COL_PRODUCTS).add({ ...product });
  },

  update(product) {
    const p = new ProductFirestore(product);
    return StockHistoryController.update(product).then(() => {
      return Firestore.collection(COL_PRODUCTS)
        .doc(product.id)
        .update({ ...p });
    });
  },

  delete(id) {
    const docRef = Firestore.collection(COL_PRODUCTS).doc(id);
    // Delete all stock histories
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
