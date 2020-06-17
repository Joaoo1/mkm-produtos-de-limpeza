import { Auth } from './firebase';
import { USER_UID, USER_NAME, USER_EMAIL } from '../constants/localstorage';

class Authentication {
  LogOut() {
    Auth.signOut()
      .then(() => {
        localStorage.removeItem(USER_EMAIL);
        localStorage.removeItem(USER_NAME);
        localStorage.removeItem(USER_UID);
      })
      .catch(() =>
        window.alert('Ocorreu um erro ao tentar desconectar usuario!')
      );
  }

  async LogIn(email, password, history) {
    try {
      const userCredential = await Auth.signInWithEmailAndPassword(
        email,
        password
      );
      localStorage.setItem(USER_UID, userCredential.user.uid);
      history.push('/dashboard');
    } catch (err) {
      switch (err.code) {
        case 'auth/invalid-email':
          window.alert('Email inválido!');
          break;
        case 'auth/user-not-found':
          window.alert('Usuario não encontrado');
          break;
        case 'auth/wrong-password':
          window.alert('Senha inválida!');
          break;
        default:
          window.alert(err);
      }
    }
  }
}

export default new Authentication();
