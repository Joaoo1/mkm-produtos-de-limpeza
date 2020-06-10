import styled from 'styled-components';

const AddressContainer = styled.div`
  padding: 20px 10px;
  border-radius: 5px;
  margin: 20px auto;
  -webkit-box-shadow: 1px 1px 2px 0px rgba(123, 123, 125, 0.8);
  -moz-box-shadow: 1px 1px 2px 0px rgba(123, 123, 125, 0.8);
  box-shadow: 1px 1px 3px 0px rgba(123, 123, 125, 0.8);
  overflow: hidden;

  hr {
    opacity: 0.1;
  }

  hr.full {
    opacity: 0.5;
    margin: 15px -25px;
  }

  h2 {
    margin: 0 0 5px 5px;
  }
`;

const ManageAddress = styled.div`
  margin: 10px 15px;
  h4 {
    margin-bottom: 5px;
  }
  input {
    width: 100%;
    margin-right: 4px;
  }
  button {
    min-width: 45px;
    margin: 0 2px;
  }
`;

export { AddressContainer, ManageAddress };
