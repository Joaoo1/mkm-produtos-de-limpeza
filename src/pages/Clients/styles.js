/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { List } from '../../styles/table';

const PurchasesMadeList = styled(List)`
  min-width: 0;

  .sale-id {
    width: 55px;
  }
`;

export { PurchasesMadeList };
