import styled from 'styled-components';

const FloatingButton = styled.div`
  border-radius: 50%;
  width: 70px;
  height: 70px;
  position: fixed;
  bottom: 40px;
  right: 70px;
  background: #00bfff;
  z-index: 9999;

  svg {
    position: relative;
    left: 30%;
    top: 30%;
  }
`;

export default FloatingButton;
