import styled from 'styled-components';

const BaseButton = styled.button`
  font-weight: 400;
  border: none;
  min-width: 220px;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  font: 500 18px 'Roboto Slab', sans-serif;
  height: var(--height-button);
`;

const PrimaryButton = styled(BaseButton)`
  background-color: var(--primary-color);
`;

const SecondaryButton = styled(BaseButton)`
  background-color: #c4c4c4;
`;

const WarningButton = styled(BaseButton)`
  background-color: #ff2424;
`;

const FloatingButton = styled.div`
  border-radius: 50%;
  width: 70px;
  height: 70px;
  position: fixed;
  bottom: 40px;
  right: 70px;
  background: #004a62;
  z-index: 9999;
  transition: 0.3s background;
  :hover {
    background: gray;
  }
  svg {
    position: relative;
    left: 30%;
    top: 30%;
  }
`;

export {
  BaseButton,
  PrimaryButton,
  SecondaryButton,
  WarningButton,
  FloatingButton,
};
