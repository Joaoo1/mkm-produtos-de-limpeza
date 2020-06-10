import { Firestore } from '../server/firebase';
import { COL_CITIES } from '../constants/firestore';

const CityController = {
  index() {
    return Firestore.collection(COL_CITIES)
      .get()
      .then(data => {
        const allCities = data.docs.map(snapshot => {
          return { name: snapshot.data().nome_cidade, id: snapshot.id };
        });
        return allCities;
      });
  },
  create(city) {
    return Firestore.collection(COL_CITIES).add(city);
  },
  delete(cityId) {
    return Firestore.collection(COL_CITIES).doc(cityId).delete();
  },
  update(newName, id) {
    return Firestore.collection(COL_CITIES)
      .doc(id)
      .update({ nome_cidade: newName });
  },
};

export default CityController;
