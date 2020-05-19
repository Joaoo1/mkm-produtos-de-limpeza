import React from 'react';
import { useHistory } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import auth from '../../server/Authentication';

import { LoginContainer, LoginFormContainer, LoginButton } from './styles';
import Logo from '../../assets/logo-novo.png';

export default function Login() {
  const history = useHistory();
  function handleLogin(e) {
    e.preventDefault();
    const { inputEmail, inputPassword } = e.target.elements;

    auth.LogIn(inputEmail.value, inputPassword.value, history);
  }

  return (
    <LoginContainer>
      <LoginFormContainer>
        <header>
          <img src={Logo} alt="Logo" />
        </header>

        <form onSubmit={handleLogin}>
          <div>
            <p>Email</p>
            <InputText id="inputEmail" placeholder="Digite seu email" />
          </div>
          <div>
            <p>Senha</p>
            <InputText
              type="password"
              id="inputPassword"
              placeholder="Digite sua senha"
            />
          </div>

          <LoginButton type="submit">Acessar o sistema</LoginButton>
        </form>
      </LoginFormContainer>
    </LoginContainer>
  );
}
