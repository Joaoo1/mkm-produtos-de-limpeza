import styled from 'styled-components';
import BaseModal from '../../styles/modal';

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;

  div {
    margin-right: 5px;
  }
`;

const StockHistoryModal = styled(BaseModal)`
  padding: 15px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 20px;
  }

  table {
    border-spacing: 0 7px;
    width: 100%;
  }

  td {
    border-bottom: 1px solid rgba(0, 0, 0, 0.15);
    border-top: 1px solid rgba(0, 0, 0, 0.15);
    padding: 15px 5px;
  }

  td:first-child {
    border-left: 1px solid rgba(0, 0, 0, 0.15);
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }

  td:last-child {
    border-right: 1px solid rgba(0, 0, 0, 0.15);
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    font-size: 26px;
    color: #6d6d6d;
    width: 5%;
    text-align: end;
    padding-right: 15px;
  }

  td:first-child svg {
    margin-top: 5px;
  }
`;

export { CheckboxContainer, StockHistoryModal };
