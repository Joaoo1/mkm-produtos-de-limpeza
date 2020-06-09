import { Firestore } from '../server/firebase';
import { COL_NEIGHBORHOODS } from '../constants/firestore';

const NeighborhoodController = {
  index() {
    return Firestore.collection(COL_NEIGHBORHOODS).get();
  },
  create(neighborhood) {
    return Firestore.collection(COL_NEIGHBORHOODS).add(neighborhood);
  },
};

export default NeighborhoodController;
