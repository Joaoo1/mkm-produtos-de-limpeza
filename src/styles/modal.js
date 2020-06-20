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
  overflow-y: scroll;
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
  height: 420px;

  input#product-name {
    width: 100%;
  }
`;

const ClientModal = styled(BaseModal)`
  height: 540px;
  overflow: visible;

  .p-autocomplete-panel {
    z-index: 9999 !important;
  }

  input {
    width: 100%;
  }

  .input-city-container {
    display: flex;
    justify-content: space-between;

    div {
      width: 100%;
    }

    div:first-child {
      margin-right: 15px;
    }
  }

  .p-autocomplete {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;

    button {
      height: var(--height-button);
    }
  }
`;

const SaleModal = styled(BaseModal)``;

const ModalButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 25px;
  button {
    margin-left: 15px;
  }
`;

const BaseSelectModal = styled(BaseModal)`
  width: 520px;
  table {
    border: 1px solid #d6d6d6;
    border-radius: 6px;
    border-spacing: 0;
    font-weight: 500;
    margin-top: 10px;
    width: 100%;

    tr {
      height: 41px;
      :hover {
        td {
          background-color: #d2ddf7;
        }
      }
    }

    td {
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
      padding: 10px 0;
    }

    /* Remove bottom border from last child because of table border radius */
    tr:last-child {
      td {
        border: none;
      }
    }

    th {
      padding: 5px 0;
    }

    th {
      background-color: rgba(0, 73, 98, 0.15);
      text-align: start;
    }

    th:first-child {
      border-top-left-radius: 6px;
      padding-left: 15px;
    }

    th:last-child {
      border-top-right-radius: 6px;
    }

    td:first-child {
      padding: 0 15px;
    }
  }

  .p-inputtext {
    width: 100%;
  }
`;

const SelectClientModal = styled(BaseSelectModal)`
  td:last-child {
    padding-right: 10px;
  }
`;

const SelectAddressModal = styled(BaseSelectModal)`
  td:last-child {
    svg {
      margin: 5px 10px;
      float: right;
    }
  }
`;

const PurchasesMadeModal = styled(BaseModal)`
  width: 700px;
`;

const EditAddressModal = styled(BaseModal)`
  height: 220px;
  input {
    width: 100%;
  }
`;

export default BaseModal;
export {
  ProductModal,
  ClientModal,
  ModalButtonsContainer,
  SaleModal,
  SelectClientModal,
  SelectAddressModal,
  PurchasesMadeModal,
  EditAddressModal,
};
