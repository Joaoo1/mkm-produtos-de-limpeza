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
  font-weight: 400;

  table {
    border: 1px solid #d6d6d6;
    border-radius: 10px;
    border-spacing: 0;
    font-weight: 500;
    margin-top: 10px;
    width: 90%;

    td {
      border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    }

    /* Remove bottom border from last child because of table border radius */
    tr:last-child {
      td {
        border: none;
      }
    }

    td,
    th {
      padding: 5px 0;
    }

    th {
      background-color: rgba(0, 73, 98, 0.15);
      text-align: start;
    }

    th:first-child {
      border-top-left-radius: var(--main-table-border-radius);
      padding-left: 15px;
    }

    th:last-child {
      border-top-right-radius: var(--main-table-border-radius);
    }

    td:first-child {
      width: 5%;
      padding: 0 15px;
    }

    td:last-child {
      svg {
        margin: 5px 10px;
        float: right;
      }
    }
  }

  > div {
    padding-top: 30px;

    button {
      background-color: #007ad9;
      border: none;
      padding: 5px;
      border-radius: 3px;
    }

    h4 {
      margin-bottom: 5px;
    }
  }

  input#quantity {
    width: 45px;
    font-size: 20px;
    text-align: center;
  }

  input#clients {
    width: 88%;
  }

  span#products {
    width: 60%;
    display: flex;
    flex-wrap: nowrap;
  }
  span#products input {
    width: 85%;
  }

  /* Autocomplete icon */
  .p-button {
    margin-right: 10px;
  }

  .p-button,
  .quantity {
    height: 46px;
  }

  label:not(:first-child) .p-radiobutton {
    margin-left: 20px;
    margin-bottom: 10px;
  }

  .p-radiobutton {
    margin-right: 4px;
  }

  .p-checkbox {
    margin-right: 5px;
    margin-bottom: 15px;
  }
`;

const Values = styled.div`
  padding-top: 30px;
  table {
    float: right;
    font-size: 24px;
    margin: 0 20px 30px 0;
    td:first-child p {
      margin-right: 15px;
    }
  }
`;

export { Header, Form, Values };
