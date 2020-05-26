import { Firestore } from '../server/firebase';
import { COL_CLIENTS } from '../constants/firestore';

const ClientController = {
  async index() {
    const data = await Firestore.collection(COL_CLIENTS).get();
    const clients = data.docs.map(doc => {
      const c = doc.data();
      c.id = doc.id;

      return c;
    });
    return clients;
  },

  create(client) {
    return Firestore.collection(COL_CLIENTS).add(client);
  },

  update(client) {
    const query = Firestore.collection(COL_CLIENTS).doc(client.id);

    const c = Object.assign(client);
    delete c.id;

    return query.update(c);
  },

  delete(id) {
    return Firestore.collection(COL_CLIENTS).doc(id).delete();
  },
};

export default ClientController;
