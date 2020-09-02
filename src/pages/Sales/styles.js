import styled from 'styled-components';

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

// eslint-disable-next-line import/prefer-default-export
export { PaymentSituation };
