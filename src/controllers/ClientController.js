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
  // async show(id) {
  //   const data = await Firestore.collection(COL_CLIENTS).doc(id).get();
  //   const c = data.doc.data();
  //   c.id = data.doc.id;
  //   return c;
  // },
  create(client, setGrowl) {
    Firestore.collection(COL_CLIENTS)
      .add(client)
      .then(
        () =>
          setGrowl({
            severity: 'success',
            summary: 'Cliente adicionado com sucesso',
          }),
        () =>
          setGrowl({
            severity: 'error',
            summary: `Ocorreu um erro ao adicionar cliente`,
          })
      );
  },
  update(client, setGrowl) {
    const query = Firestore.collection(COL_CLIENTS).doc(client.id);

    const c = Object.assign(client);
    delete c.id;

    query.update(c).then(
      () =>
        setGrowl({
          severity: 'success',
          summary: 'Cliente atualizado com sucesso',
        }),
      () =>
        setGrowl({
          severity: 'error',
          summary: `Ocorreu um erro ao atualizar produto`,
        })
    );
  },
  delete(id, setGrowl) {
    Firestore.collection(COL_CLIENTS)
      .doc(id)
      .delete()
      .then(
        () =>
          setGrowl({
            severity: 'success',
            summary: 'Cliente excluido com sucesso',
          }),
        () =>
          setGrowl({
            severity: 'error',
            summary: `Ocorreu um erro ao excluir produto`,
          })
      );
  },
};

export default ClientController;
