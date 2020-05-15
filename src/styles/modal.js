import styled from 'styled-components';
import ReactModal from 'react-modal';

const BaseModal = styled(ReactModal)`
  position: absolute;
  top: 15%;
  bottom: 5%;
  left: 50%;
  width: 580px;
  /* To centralize the modal, set a half of the width modal to left */
  margin-left: -290px;
  background-color: #fcfcfc;
  overflow-y: scroll;
  border-radius: 5px;
  padding: 15px 20px;
  font-weight: normal;

  input {
    margin-top: 3px;
  }

  p {
    margin-top: 8px;
  }

  hr {
    margin: 10px -15px 15px -15px;
    opacity: 0.3;
  }
  /* Hide scrollbars but keep functionality */
  ::-webkit-scrollbar {
    display: none;
    -ms-overflow-style: none; /* For IE and Edge*/
  }

  h2 {
    font-weight: normal;
    font-size: 20px;
  }
`;

const ProductModal = styled(BaseModal)`
  height: 435px;

  input#product-name {
    width: 100%;
  }
`;

const ClientModal = styled(BaseModal)`
  height: 455px;

  input {
    width: 100%;
  }
`;

const ModalButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 25px;
  button {
    margin-left: 15px;
  }
`;
export default BaseModal;
export { ProductModal, ClientModal, ModalButtonsContainer };
