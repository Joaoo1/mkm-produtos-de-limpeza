import styled from 'styled-components';
import BaseModal from '../../styles/modal';

const ConfirmModal = styled(BaseModal)`
  position: absolute;
  top: 25%;
  left: 50%;
  width: 480px;
  margin-left: -240px;
  background-color: #fcfcfc;
  border-radius: 5px;
  padding: 15px 20px;
  font-weight: normal;
  font-size: 18px;
`;

export default ConfirmModal;
