import styled from 'styled-components';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;

  p {
    font-size: 31px;
    display: flex;
    align-items: center;

    svg {
      margin-right: 20px;
    }
  }
`;

const Form = styled.div`
  margin-top: 30px;
`;

const Values = styled.div`
  background-color: #f2f3f2;
`;

export { Header, Form, Values };
