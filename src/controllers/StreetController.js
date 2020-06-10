import { Firestore } from '../server/firebase';
import { COL_STREETS } from '../constants/firestore';

const StreetController = {
  index() {
    return Firestore.collection(COL_STREETS)
      .get()
      .then(data => {
        const allStreets = data.docs.map(snapshot => {
          return { name: snapshot.data().nome_rua, id: snapshot.id };
        });
        return allStreets;
      });
  },
  create(street) {
    return Firestore.collection(COL_STREETS).add(street);
  },
  delete(streetId) {
    return Firestore.collection(COL_STREETS).doc(streetId).delete();
  },
  update(newName, id) {
    return Firestore.collection(COL_STREETS)
      .doc(id)
      .update({ nome_rua: newName });
  },
};

export default StreetController;
