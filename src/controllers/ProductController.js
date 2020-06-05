import Big from 'big.js';
import { Firestore } from '../server/firebase';
import { COL_PRODUCTS } from '../constants/firestore';

const ProductController = {
  async index() {
    const data = await Firestore.collection(COL_PRODUCTS)
      .orderBy('nome', 'asc')
      .get();
    const products = data.docs.map(doc => {
      const product = doc.data();
      product.id = doc.id;
      product.preco = new Big(product.preco);
      return product;
    });

    return products;
  },
  create(product) {
    product.nome = product.newName;
    product.preco = product.preco.toFixed(2);
    return Firestore.collection(COL_PRODUCTS).add(product);
  },

  update(product) {
    const query = Firestore.collection(COL_PRODUCTS).doc(product.id);

    const p = Object.assign(product);
    p.nome = product.newName;
    p.preco = product.preco.toFixed(2);
    // Product document don't need a field with itself id.
    delete p.id;
    if (!p.manageStock && p.currentStock) {
      p.currentStock = 0;
    }
    return query.update(p);
  },

  delete(id) {
    return Firestore.collection(COL_PRODUCTS).doc(id).delete();
  },
};

export default ProductController;
