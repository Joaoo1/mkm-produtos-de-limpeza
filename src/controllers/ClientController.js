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

  create(client, growl) {
    Firestore.collection(COL_CLIENTS)
      .add(client)
      .then(
        () =>
          growl.show({
            severity: 'success',
            summary: 'Cliente adicionado com sucesso',
          }),
        () =>
          growl.show({
            severity: 'error',
            summary: `Ocorreu um erro ao adicionar cliente`,
          })
      );
  },

  update(client, growl) {
    const query = Firestore.collection(COL_CLIENTS).doc(client.id);

    const c = Object.assign(client);
    delete c.id;

    query.update(c).then(
      () =>
        growl.show({
          severity: 'success',
          summary: 'Cliente atualizado com sucesso',
        }),
      () =>
        growl.show({
          severity: 'error',
          summary: `Ocorreu um erro ao atualizar produto`,
        })
    );
  },

  delete(id, growl) {
    Firestore.collection(COL_CLIENTS)
      .doc(id)
      .delete()
      .then(
        () =>
          growl.show({
            severity: 'success',
            summary: 'Cliente excluido com sucesso',
          }),
        () =>
          growl.show({
            severity: 'error',
            summary: `Ocorreu um erro ao excluir produto`,
          })
      );
  },
};

export default ClientController;
