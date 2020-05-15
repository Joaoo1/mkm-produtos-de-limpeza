import React from 'react';
import { useHistory } from 'react-router-dom';
import auth from '../../server/Authentication';

export default function Login() {
  const history = useHistory();
  function handleLogin(e) {
    e.preventDefault();
    const { inputEmail, inputPassword } = e.target.elements;

    auth.LogIn(inputEmail.value, inputPassword.value, history);
  }

  return (
    <form onSubmit={handleLogin}>
      <input type="text" name="inputEmail" id="email" />
      <input type="password" name="inputPassword" id="password" />
      <button type="submit">Login</button>
    </form>
  );
}
