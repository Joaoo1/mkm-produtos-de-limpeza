import { Firestore } from '../server/firebase';
import { COL_PRODUCTS } from '../constants/firestore';

const ProductController = {
  async index() {
    const data = await Firestore.collection(COL_PRODUCTS).get();
    const products = data.docs.map(doc => {
      const product = doc.data();
      product.id = doc.id;
      return product;
    });

    return products;
  },
  create(product, growl) {
    Firestore.collection(COL_PRODUCTS)
      .add(product)
      .then(
        () =>
          growl.show({
            severity: 'success',
            summary: `${product.nome} adicionado com sucesso`,
          }),
        () =>
          growl.show({
            severity: 'error',
            summary: `Ocorreu um erro ao adicionar produto`,
          })
      );
  },

  update(product, growl) {
    const query = Firestore.collection(COL_PRODUCTS).doc(product.id);

    // Product document don't need a field with itself id.
    const p = Object.assign(product);
    delete p.id;
    if (!p.manageStock && p.currentStock) {
      p.currentStock = 0;
    }
    query.update(p).then(
      () =>
        growl.show({
          severity: 'success',
          summary: `${product.nome} atualizado com sucesso`,
        }),
      () =>
        growl.show({
          severity: 'error',
          summary: `Ocorreu um erro ao adicionar produto`,
        })
    );
  },

  delete(id, growl) {
    if (id) {
      Firestore.collection(COL_PRODUCTS)
        .doc(id)
        .delete()
        .then(
          () =>
            growl.show({
              severity: 'success',
              summary: `Produto excluido com sucesso`,
            }),
          () =>
            growl.show({
              severity: 'error',
              summary: `Ocorreu um erro ao adicionar produto`,
            })
        );
    }
  },
};

export default ProductController;
