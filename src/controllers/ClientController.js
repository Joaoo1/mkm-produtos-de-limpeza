import { Firestore } from '../server/firebase';
import { COL_CLIENTS } from '../constants/firestore';
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

  create(client) {
    const c = new Client(client);
    c.formatToFirestore();
    return Firestore.collection(COL_CLIENTS).add({ ...c });
  },

  update(client) {
    const c = new Client(client);
    c.formatToFirestore();
    return Firestore.collection(COL_CLIENTS)
      .doc(client.id)
      .update({ ...c });
  },

  delete(id) {
    return Firestore.collection(COL_CLIENTS).doc(id).delete();
  },
};

export default ClientController;
