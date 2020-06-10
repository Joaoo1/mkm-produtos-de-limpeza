import { Firestore } from '../server/firebase';
import { COL_NEIGHBORHOODS } from '../constants/firestore';

const NeighborhoodController = {
  index() {
    return Firestore.collection(COL_NEIGHBORHOODS)
      .get()
      .then(data => {
        const allNeighborhoods = data.docs.map(snapshot => {
          return { name: snapshot.data().nome_bairro, id: snapshot.id };
        });
        return allNeighborhoods;
      });
  },
  create(neighborhood) {
    return Firestore.collection(COL_NEIGHBORHOODS).add(neighborhood);
  },
  delete(neighborhoodId) {
    return Firestore.collection(COL_NEIGHBORHOODS).doc(neighborhoodId).delete();
  },
  update(newName, id) {
    return Firestore.collection(COL_NEIGHBORHOODS)
      .doc(id)
      .update({ nome_bairro: newName });
  },
};

export default NeighborhoodController;
