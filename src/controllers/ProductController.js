import { Firestore } from '../server/firebase';
import { COL_PRODUCTS } from '../constants/firestore';
import Product from '../models/Product';

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
    return Firestore.collection(COL_PRODUCTS)
      .doc(product.id)
      .update({ ...p });
  },

  delete(id) {
    return Firestore.collection(COL_PRODUCTS).doc(id).delete();
  },
};

export default ProductController;
