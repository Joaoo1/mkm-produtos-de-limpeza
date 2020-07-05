import styled from 'styled-components';

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

const PaymentSituation = styled.td`
  color: ${props => {
    switch (props.situation) {
      case 'PAGO':
        return '#06992c';
      case 'NÃO PAGO':
        return 'red';
      case 'PARCIALMENTE PAGO':
        return '#c9b00c';
      default:
        return 'transparent';
    }
  }};
`;

export { FloatingButton, PaymentSituation };
