import { Firestore } from '../server/firebase';
import { COL_STREETS } from '../constants/firestore';

const StreetController = {
  index() {
    return Firestore.collection(COL_STREETS).get();
  },
  create(street) {
    return Firestore.collection(COL_STREETS).add(street);
  },
};

export default StreetController;
