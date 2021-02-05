import styled from 'styled-components';
import { BaseButton } from '../../styles/button';

const LoginContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(26, 198, 255, 1);
  background: -moz-linear-gradient(
    top,
    rgba(26, 198, 255, 1) 0%,
    rgba(26, 198, 255, 0.42) 51%,
    rgba(0, 80, 107, 0.74) 100%
  );
  background: -webkit-linear-gradient(
    top,
    rgba(26, 198, 255, 1) 0%,
    rgba(26, 198, 255, 0.42) 51%,
    rgba(0, 80, 107, 0.74) 100%
  );
  background: -o-linear-gradient(
    top,
    rgba(26, 198, 255, 1) 0%,
    rgba(26, 198, 255, 0.42) 51%,
    rgba(0, 80, 107, 0.74) 100%
  );
  background: -ms-linear-gradient(
    top,
    rgba(26, 198, 255, 1) 0%,
    rgba(26, 198, 255, 0.42) 51%,
    rgba(0, 80, 107, 0.74) 100%
  );
  background: linear-gradient(
    to bottom,
    rgba(26, 198, 255, 1) 0%,
    rgba(26, 198, 255, 0.42) 51%,
    rgba(0, 80, 107, 0.74) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#1ac6ff', endColorstr='#00506b', GradientType=0 );
`;

const LoginFormContainer = styled.div`
  width: 500px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5px;
  }

  form {
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 100%;
    font-size: 14px;
    margin: 10px 0 50px 0;
    font-weight: bold;

    button,
    input {
      width: 325px;
      height: 53px;
      border-radius: 7px;
    }

    input {
      margin: 5px 0 20px 0;
      background-color: rgba(0, 74, 98, 0.20);
      padding-left: 15px;
    }

    input::placeholder {
      color: white;
    }
  }
`;

const LoginButton = styled(BaseButton)`
  width: 325px;
  height: 53px;
  border-radius: 7px;
  background-color: var(--primary-color);
`;

export { LoginContainer, LoginFormContainer, LoginButton };
