import styled from 'styled-components';
import { List } from '../../styles/table';

const TopSellingProducts = styled(List)`
  padding: 5px 12px;
  min-width: 300px !important;
  max-width: 400px;

  td ~ td {
    width: 35%;
  }
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  margin-top: 30px;
  padding: 5px;
`;

const Card = styled.div`
  background: rgba(6, 193, 255, 0.16);
  background-color: #45afed;
  /* background-color: #4591ed; */
  color: #fff;
  height: 120px;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px 10px 20px;

  div {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: space-around;
  }

  .card-title {
    font-size: 20px;
  }

  .card-value {
    font-size: 30px;
  }

  small {
    font-weight: 300;
  }
`;

const ChartContainer = styled.div`
  padding: 30px;
  border: 1px solid rgba(0, 73, 98, 0.2);
  margin: 30px 0;
`;

export { TopSellingProducts, CardContainer, Card, ChartContainer };
