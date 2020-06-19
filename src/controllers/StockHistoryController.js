import { Firestore } from '../server/firebase';
import { COL_PRODUCTS, SUBCOL_STOCK_HISTORY } from '../constants/firestore';
import { convertTimeStampToString } from '../helpers/FormatDate';

const StockHistoryController = {
  async index(productId) {
    const data = await Firestore.collection(COL_PRODUCTS)
      .doc(productId)
      .collection(SUBCOL_STOCK_HISTORY)
      .orderBy('date', 'desc')
      .get();
    const stockHistories = data.docs.map(doc => {
      const stockHistory = doc.data();
      stockHistory.id = doc.id;
      stockHistory.date = convertTimeStampToString(stockHistory.date);
      return stockHistory;
    });

    return stockHistories;
  },
  async create(product, client) {
    const doc = await Firestore.collection(COL_PRODUCTS).doc(product.id).get();
    const { currentStock } = doc.data();

    const stockHistory = {
      date: new Date(),
      quantity: product.quantity,
      stockChange: false,
      currentStock: currentStock - product.quantity,
      client,
      saleProductId: product.id,
    };

    Firestore.collection(COL_PRODUCTS)
      .doc(product.id)
      .collection(SUBCOL_STOCK_HISTORY)
      .add(stockHistory);

    doc.ref.update({ currentStock: currentStock - product.quantity });
  },
  async update(product) {
    const docRef = Firestore.collection(COL_PRODUCTS).doc(product.id);

    if (!product.manageStock) {
      return docRef
        .collection(SUBCOL_STOCK_HISTORY)
        .get()
        .then(snapshot => {
          snapshot.docs.forEach(doc => doc.ref.delete());
          return Promise.resolve();
        });
    }

    const doc = await docRef.get();
    const { currentStock } = doc.data();

    if (currentStock !== product.currentStock) {
      const stockHistory = {
        date: new Date(),
        quantity:
          Number(currentStock) > Number(product.currentStock)
            ? currentStock - product.currentStock
            : product.currentStock - currentStock,
        stockChange: true,
        currentStock: product.currentStock,
        stockAdded: currentStock < product.currentStock,
      };
      return Firestore.collection(COL_PRODUCTS)
        .doc(product.id)
        .collection(SUBCOL_STOCK_HISTORY)
        .add(stockHistory);
    }

    return Promise.resolve();
  },
};

export default StockHistoryController;
