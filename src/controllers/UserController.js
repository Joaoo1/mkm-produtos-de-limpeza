import { Firestore } from '../server/firebase';
import { COL_USERS } from '../constants/firestore';

const UserController = {
  show(uid) {
    return Firestore.collection(COL_USERS)
      .doc(uid)
      .get()
      .then(snapshot => {
        const { name, email } = snapshot.data();
        return { name, email };
      });
  },
};

export default UserController;
