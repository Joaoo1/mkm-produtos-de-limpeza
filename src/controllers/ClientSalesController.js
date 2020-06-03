import { Firestore } from '../server/firebase';
import Sale from '../models/Sale';
import { COL_SALES, SUBCOL_SALE_PRODUCTS } from '../constants/firestore';

const ClientSalesController = {
  async index(clientId) {
    function getProductsBySaleId(saleId) {
      const products = [];
      return Firestore.collection(COL_SALES)
        .doc(saleId)
        .collection(SUBCOL_SALE_PRODUCTS)
        .get()
        .then(productsData => {
          productsData.forEach(doc => {
            const product = doc.data();
            product.id = doc.id;
            products.push(product);
          });

          return products;
        });
    }
    return Firestore.collection(COL_SALES)
      .where('idCliente', '==', clientId)
      .get()
      .then(salesData => {
        const sales = [];
        return Promise.all(
          salesData.docs.map(doc => {
            const sale = doc.data();
            sale.id = doc.id;
            const productsPromise = getProductsBySaleId(sale.id);
            return productsPromise.then(products => {
              sale.products = products;
              sales.push(new Sale(sale));
              return sales;
            });
          })
        ).then(sales => (sales.length > 0 ? sales[0] : []));
      });
  },
};

export default ClientSalesController;
