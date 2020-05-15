import styled from 'styled-components';
import BaseModal from '../../styles/modal';

const ConfirmModal = styled(BaseModal)`
  position: absolute;
  top: 25%;
  left: 50%;
  width: 540px;
  margin-left: -240px;
  background-color: #fcfcfc;
  border-radius: 5px;
  padding: 15px 20px;
  font-weight: 300;
  font-size: 18px;
  height: 240px;
  padding: 25px;

  p {
    margin: 25px 0px;
  }
`;

export default ConfirmModal;
