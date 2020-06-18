import { Firestore } from '../server/firebase';
import { COL_CLIENTS } from '../constants/firestore';
import ClientFirestore from '../models/ClientFirestore';
import Client from '../models/Client';

const ClientController = {
  async index() {
    const data = await Firestore.collection(COL_CLIENTS)
      .orderBy('nome', 'asc')
      .get();
    const clients = data.docs.map(doc => {
      return new Client({ ...doc.data(), id: doc.id });
    });
    return clients;
  },

  create(newClient) {
    const client = new ClientFirestore(newClient);
    return Firestore.collection(COL_CLIENTS).add(client);
  },

  update(client) {
    const c = new ClientFirestore(client);
    return Firestore.collection(COL_CLIENTS).doc(client.id).update(c);
  },

  delete(id) {
    return Firestore.collection(COL_CLIENTS).doc(id).delete();
  },
};

export default ClientController;
