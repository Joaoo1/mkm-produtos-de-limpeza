import { Firestore, Functions } from '../server/firebase';
import {
  COL_DASHBOARD,
  DOC_SALES_12_MONTHS,
  DOC_GENERAL_INFO,
  COL_SALES,
  COL_PRODUCTS,
  COL_CLIENTS,
} from '../constants/firestore';
import {
  convertTimeStampToString,
  convertDateToString,
} from '../helpers/FormatDate';

const DashboardController = {
  async getSalesFromLast12Months(isUpdate) {
    if (isUpdate) {
      const salesFromLast12Months = Functions.httpsCallable(
        'salesFromLast12Months'
      );
      return salesFromLast12Months();
    }

    const sales = await Firestore.collection(COL_DASHBOARD)
      .doc(DOC_SALES_12_MONTHS)
      .get()
      .then(doc => doc.data());

    sales.updatedAt = convertTimeStampToString(sales.updatedAt);

    return sales;
  },
  async getGeneralinfo(isUpdate) {
    function getTotalSales() {
      return Firestore.collection(COL_SALES)
        .get()
        .then(snapshot => snapshot.docs.length);
    }

    function getTotalClients() {
      return Firestore.collection(COL_CLIENTS)
        .get()
        .then(snapshot => snapshot.docs.length);
    }

    function getTotalProducts() {
      return Firestore.collection(COL_PRODUCTS)
        .get()
        .then(snapshot => snapshot.docs.length);
    }

    if (isUpdate) {
      const sales = await getTotalSales();
      const clients = await getTotalClients();
      const products = await getTotalProducts();
      // Update general info document
      Firestore.collection(COL_DASHBOARD)
        .doc(DOC_GENERAL_INFO)
        .set({ sales, clients, products, updatedAt: new Date() });
      return {
        sales,
        clients,
        products,
        updatedAt: convertDateToString(new Date()),
      };
    }

    return Firestore.collection(COL_DASHBOARD)
      .doc(DOC_GENERAL_INFO)
      .get()
      .then(snapshot => {
        return {
          ...snapshot.data(),
          updatedAt: convertTimeStampToString(snapshot.data().updatedAt),
        };
      });
  },
};
export default DashboardController;
