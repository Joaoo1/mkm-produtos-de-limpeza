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
  index() {
    return Firestore.collection(COL_USERS)
      .get()
      .then(data => {
        const allUsers = data.docs.map(snapshot => {
          const { name, email, uid } = snapshot.data();
          return { name, email, uid };
        });
        
        return allUsers;
      });
  },
};

export default UserController;
