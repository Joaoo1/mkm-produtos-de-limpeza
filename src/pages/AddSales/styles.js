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

  span#products {
    width: 75%;
  }

  span#products input {
    width: 89%;
  }
  input#clients {
    width: calc(90% - 12px);
  }

  input#discount {
    width: 50%;
  }

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
    width: 100%;

    button {
      background-color: #007ad9;
      border: none;
      padding: 5px;
      border-radius: 3px;
    }

    input#quantity,
    .quantity {
      height: 46px;
    }

    input#quantity {
      width: 30px;
    }

    h4 {
      margin-bottom: 5px;
    }
  }

  .p-radiobutton:not(:first-child) {
    margin-left: 20px;
  }

  .p-radiobutton,
  .p-checkbox {
    margin-right: 5px;
  }

  .p-checkbox {
    margin-bottom: 10px;
  }

  /* Autocomplete icon */
  .p-button {
    height: 46px;
  }

  /* Work around for height bug */
  .height60px {
    height: 60px;
  }
`;

const Values = styled.div`
  padding-top: 30px;
  margin-top: 30px;
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
