import { Firestore } from '../server/firebase';
import Sale from '../models/Sale';
import SaleFirestore from '../models/SaleFirestore';
import {
  COL_SALES,
  SUBCOL_SALE_PRODUCTS,
  COL_SALE_IDS,
} from '../constants/firestore';

const SaleController = {
  index(limit, filters) {
    let query = Firestore.collection(COL_SALES).orderBy('dataVenda', 'desc');

    if (limit && !Number.isNaN(limit)) query = query.limit(limit);

    if (filters) {
      filters.forEach(filter => {
        query = query.where(filter.field, filter.operator, filter.value);
      });
    }

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

    return query.get().then(salesData => {
      const sales = [];
      return Promise.all(
        salesData.docs.map(doc => {
          const sale = doc.data();
          sale.id = doc.id;
          const productsPromise = getProductsBySaleId(sale.id);
          return productsPromise.then(products => {
            const saleWithProducts = new Sale(sale);
            saleWithProducts.products = products;
            sales.push(saleWithProducts);
            return sales;
          });
        })
      ).then(
        sales => (sales.length > 0 ? sales[0] : []),
        () => []
      );
    });
  },

  create(sale) {
    // Generate a ID for sale that has not been used
    return Firestore.collection(COL_SALE_IDS)
      .get()
      .then(data => {
        // Get all IDS that has already been used
        const usedIds = data.docs.map(snapshot => {
          const id = snapshot.data();
          return id.venda;
        });
        // The generate ID must to be between 1k and 10k
        for (let i = 1000; i < 10000; i++) {
          if (!usedIds.includes(i)) {
            // A valid ID was found, now format sale and create it
            const mSale = new SaleFirestore({
              ...sale,
              saleId: i,
              paid: sale.paymentMethod === 'paid',
            });

            Firestore.collection(COL_SALE_IDS).add({ venda: i });
            return Firestore.collection(COL_SALES).add({
              ...mSale,
              dataVenda: new Date(),
            });
          }
        }

        return Promise.reject();
      });
  },

  async update(sale, isFinishSale) {
    let mSale;

    if (isFinishSale) {
      mSale = new SaleFirestore({
        ...sale,
        paidValue: sale.netValue,
        paid: true,
        valueToReceive: '0.00',
      });
    } else {
      mSale = new SaleFirestore({
        ...sale,
        paid: sale.paymentMethod === 'paid',
      });
    }

    return Firestore.collection(COL_SALES).doc(sale.id).update(mSale);
  },

  delete(saleId, idVenda) {
    // Deleting all products from this sale
    Firestore.collection(COL_SALES)
      .doc(saleId)
      .collection(SUBCOL_SALE_PRODUCTS)
      .get()
      .then(snapshot => {
        snapshot.docs.forEach(sale => sale.ref.delete());
      });

    // Making the ID available to be used by another sale
    Firestore.collection(COL_SALE_IDS)
      .where('venda', '==', idVenda)
      .get()
      .then(snapshot => snapshot.docs[0].ref.delete());

    return Firestore.collection(COL_SALES).doc(saleId).delete();
  },
};

export default SaleController;
