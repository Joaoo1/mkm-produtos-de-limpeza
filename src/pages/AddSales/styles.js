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

  input[type='text'] {
    width: 80%;

    ::placeholder {
      font-size: 14px;
    }
  }

  table {
    border: 1px solid #d6d6d6;
    border-radius: 10px;
    border-spacing: 0;
    font-weight: 500;
    margin-top: 10px;
    max-width: 513px;
    width: 87%;

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
    display: flex;
    flex-direction: column;
    padding-top: 10px;

    button {
      background-color: #007ad9;
      border: none;
      padding: 5px;
      border-radius: 3px;
    }

    p {
      margin-bottom: 5px;
      margin-top: 20px;
    }
  }

  .p-radiobutton:not(:first-child) {
    margin-left: 20px;
  }

  .p-radiobutton {
    margin-right: 5px;
  }

  /* Autocomplete icon */
  .p-button {
    height: 46px;
  }

  .p-autocomplete {
    width: 100%;
    input {
      padding-left: 15px;
    }
  }
`;

const Values = styled.div`
  background-color: #f2f3f2;
`;

export { Header, Form, Values };
