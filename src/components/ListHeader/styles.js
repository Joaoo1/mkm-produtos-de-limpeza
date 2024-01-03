import styled from 'styled-components';
import { BaseButton, PrimaryButton } from '../../styles/button';

const ListHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;

  .p-inputtext {
    margin: 0 5px;
    border-radius: 20px;
    width: 100%;
    min-width: 300px;
    padding-left: 20px;
  }
`;

const AddButton = styled(PrimaryButton)`
  margin: 0 5px;
  border-radius: 20px;

  svg {
    padding-right: 5px;
  }
`;

// Filter styles
const FilterButton = styled(BaseButton)`
  background-color: #f1f8fe;
  color: var(--primary-font-color);
  border: 0.5px solid rgba(0, 74, 98, 0.25);
  border-radius: 20px;
  min-width: 170px;
  margin-right: 20px;

  svg {
    padding-right: 5px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-right: 15px;
  max-width: 820px;

  .p-formgroup-inline {
    width: 100%;
  }

  .p-button {
    height: var(--height-button);
    margin-top: 10px;
  }

  .period {
    margin: 10px 5px;
    input {
      margin: 15px 15px 0 0;
    }
  }

  .address {
    margin: 10px 5px;
    .p-dropdown {
      width: 180px;
      text-align: center;
      margin: 5px 10px 0 0;
    }

    input {
      margin-top: 10px;
    }
  }

  .situation {
    margin: 10px 5px;
    p {
      margin-bottom: 5px;
    }

    label {
      font-weight: 400;
      margin: 5px;
    }
    .p-checkbox {
      margin-right: 5px;
    }
  }

  .seller {
    width: 180px;
  }

  .buttons {
    align-self: flex-end;
    margin-top: 15px;
    display: flex;
    justify-content: flex-end;

    button {
      margin-right: 10px;
      border-radius: 20px;
      border: 0.5px solid rgba(0, 74, 98, 0.25);
      background: #f1f8fe;
      color: var(--primary-fontupdate-color);
      height: 40px;
      padding: 5px 10px;
      font-size: 1rem;
      font-weight: 600;
      transition: opacity 0.25s;
    }
    button ~ button {
      background-color: #004a62;
      color: #fff;
    }
  }
`;

const InputIcon = styled.i`
  position: relative;
  margin-left: -40px;
  margin-right: 40px;
`;

export {
  FilterButton,
  AddButton,
  ListHeaderContainer,
  FilterContainer,
  InputIcon,
};
