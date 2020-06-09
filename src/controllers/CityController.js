import { Firestore } from '../server/firebase';
import { COL_CITIES } from '../constants/firestore';

const CityController = {
  index() {
    return Firestore.collection(COL_CITIES).get();
  },
  create(city) {
    return Firestore.collection(COL_CITIES).add(city);
  },
};

export default CityController;
