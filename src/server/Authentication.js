import { Auth } from './firebase';

class Authentication {
  LogOut() {
    Auth.signOut().catch(() =>
      window.alert('Ocorreu um erro ao tentar desconectar usuario!')
    );
  }

  async LogIn(email, password, history) {
    try {
      await Auth.signInWithEmailAndPassword(email, password);
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
          window.alert(err.code);
      }
    }
  }
}

export default new Authentication();
