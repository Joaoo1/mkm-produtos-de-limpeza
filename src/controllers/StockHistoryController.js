import { Firestore } from '../server/firebase';
import { COL_PRODUCTS, SUBCOL_STOCK_HISTORY } from '../constants/firestore';

const StockHistoryController = {
  async index(productId) {
    const data = await Firestore.collection(COL_PRODUCTS)
      .doc(productId)
      .collection(SUBCOL_STOCK_HISTORY)
      .get();
    const stockHistories = data.docs.map(doc => {
      const stockHistory = doc.data();
      stockHistory.id = doc.id;
      return stockHistory;
    });

    return stockHistories;
  },
};

export default StockHistoryController;
