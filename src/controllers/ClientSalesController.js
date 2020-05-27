import { Firestore } from '../server/firebase';
import { COL_SALES, SUBCOL_SALE_PRODUCTS } from '../constants/firestore';

const ClientSalesController = {
  async index(clientId) {
    const salesData = await Firestore.collection(COL_SALES)
      .where('idCliente', '==', clientId)
      .get();

    const sales = salesData.docs.map(snapshot => {
      const sale = snapshot.data();
      sale.id = snapshot.id;
      return sale;
    });

    sales.forEach(sale =>
      Firestore.collection(COL_SALES)
        .doc(sale.id)
        .collection(SUBCOL_SALE_PRODUCTS)
        .get()
        .then(productData => {
          const products = productData.docs.map(doc => {
            const p = doc.data();
            p.id = doc.id;
            return p;
          });

          sale.products = products;
        })
    );

    console.log(sales);
    return sales;
  },
};

export default ClientSalesController;
