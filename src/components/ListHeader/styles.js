import styled from 'styled-components';
import { BaseButton, PrimaryButton } from '../../styles/button';

const ListHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 30px 0;

  input {
    margin: 0 5px;
    border-radius: 20px;
    width: 100%;
    min-width: 300px;
  }
`;

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

const AddButton = styled(PrimaryButton)`
  margin: 0 5px;
  border-radius: 20px;

  svg {
    padding-right: 5px;
  }
`;

export default ListHeaderContainer;
export { FilterButton, AddButton };
