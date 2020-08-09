import { Firestore } from '../server/firebase';
import Sale from '../models/Sale';
import { COL_SALES, SALE_CLIENT_ID } from '../constants/firestore';

const ClientSalesController = {
  async index(clientId) {
    const sales = await Firestore.collection(COL_SALES)
      .orderBy('dataVenda', 'desc')
      .where('idCliente', '==', clientId)
      .get();
    return sales.docs.map(sale => new Sale({ ...sale.data(), id: sale.id }));
  },
  update(clientId, toUpdate) {
    Firestore.collection(COL_SALES)
      .where(SALE_CLIENT_ID, '==', clientId)
      .get()
      .then(snapshot =>
        snapshot.docs.forEach(sale => sale.ref.update(toUpdate))
      );
  },
};

export default ClientSalesController;
