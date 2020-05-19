import styled from 'styled-components';
import { BaseButton } from './button';

<<<<<<< HEAD
export const List = styled.table`
=======
const List = styled.table`
  min-width: 770px;
>>>>>>> d8ce1ba18720e301cbe3396056e6e991b3fe93b0
  width: 100%;
  overflow: scroll;
  border-collapse: separate;
  border-spacing: 0px 7px;

  thead {
    background-color: rgba(45, 156, 219, 0.15);
  }

  th,
  td {
    text-align: start;
    padding: 10px;
  }

  tr {
    margin: 5px;
    background: rgba(6, 193, 255, 0.05);
  }

  tr:first-child,
  th:first-child {
    border-top-left-radius: var(--main-table-border-radius);
    border-bottom-left-radius: var(--main-table-border-radius);
  }

  tr:last-child,
  th:last-child {
    border-top-right-radius: var(--main-table-border-radius);
    border-bottom-right-radius: var(--main-table-border-radius);
  }

  .more-icon {
    float: right;
    padding: 8px 5px 0px 0px;
    /* transition: opacity 0.2s; */
  }

  .more-icon:hover :nth-child(2) {
    display: block;
  }
`;

const DropdownList = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownContent = styled.div`
  display: none;
  position: absolute;
  top: 2;
  right: 0;
  background-color: #fcfcfc;
  min-width: 230px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.25);
  z-index: 1;
`;

const DropdownItem = styled(BaseButton)`
  background-color: transparent;
  width: 100%;
  border: none;
  font: bold 15px 'Roboto Slab', sans-serif;
  color: var(--primary-font-color);

  :hover {
    background-color: rgba(6, 193, 255, 0.45);
  }
`;

export { List, DropdownContent, DropdownItem, DropdownList };
