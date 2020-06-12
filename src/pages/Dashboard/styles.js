import styled from 'styled-components';
import { List } from '../../styles/table';

const TopSellingProducts = styled(List)`
  padding: 5px 12px;
  height: 25%;
  min-width: 340px;
  width: 100%;
  td ~ td {
    width: 35%;
  }
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 5px;
  margin-top: 4px;
  padding: 5px;
`;

const Card = styled.div`
  background: rgba(6, 193, 255, 0.16);
  background-color: #45afed;
  color: #fff;
  height: 120px;
  border-radius: 6px;
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

const SalesChartContainer = styled.div`
  padding: 30px;
  border: 1px solid rgba(0, 73, 98, 0.2);
  margin: 30px 0;
  border-radius: 6px;
  svg {
    margin: 5px 5px 5px 10px;
  }
`;

const ClientsChartContainer = styled.div`
  > div {
    border: 1px solid rgba(0, 73, 98, 0.2);
    margin: 30px 0;
    border-radius: 6px;
    padding: 15px;
  }
`;

const UpdatedAt = styled.div`
  font-size: 13px;
  color: gray;
`;

const RefreshInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin: 15px 15px 10px 0;
  p {
    font-size: 16px;
  }

  svg {
    margin-left: 5px;
  }
`;

const Welcome = styled.div`
  p {
    margin: 25px 0 0 15px;
    font-size: 24px;
  }
`;
export {
  TopSellingProducts,
  CardContainer,
  Card,
  SalesChartContainer,
  ClientsChartContainer,
  UpdatedAt,
  RefreshInfo,
  Welcome,
};
