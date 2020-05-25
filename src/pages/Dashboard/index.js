import React from 'react';
import { Chart } from 'primereact/chart';
import { FiDollarSign, FiPackage, FiUsers } from 'react-icons/fi';

import {
  TopSellingProducts,
  CardContainer,
  Card,
  SalesChartContainer,
  ClientsChartContainer,
} from './styles';

export default function Dashboard() {
  const clientChartData = {
    labels: ['Janeiro', 'Fevereiro', 'Março'],
    datasets: [
      {
        label: 'Novos clientes',
        data: [65, 59, 80],
        fill: false,
        backgroundColor: '#42A5F5',
        borderColor: '#42A5F5',
      },
    ],
  };

  const salesChartData = {
    labels: [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ],

    datasets: [
      {
        type: 'bar',
        label: 'Vendas',
        backgroundColor: '#1859ad',
        data: [340, 213, 132, 465, 345, 432, 123, 678, 467, 574, 267, 734],
      },
    ],
  };

  const salesChartOptions = {
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    responsive: true,
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
        },
      ],
    },
  };

  return (
    <>
      <CardContainer className="p-grid">
        <Card className="p-col-12 p-md-3">
          <div>
            <p className="card-title">Vendas</p>
            <p className="card-value">1500</p>
            <small>20% a mais que mês passado</small>
          </div>
          <FiDollarSign size={40} />
        </Card>
        <Card className="p-col-12 p-md-3">
          <div>
            <p className="card-title">Clientes</p>
            <p className="card-value">4500</p>
            <small>20% a mais que mês passado</small>
          </div>
          <FiUsers size={40} />
        </Card>
        <Card className="p-col-12 p-md-3">
          <div>
            <p className="card-title">Produtos</p>
            <p className="card-value">100</p>
            <small>20% a mais que mês passado</small>
          </div>
          <FiPackage size={40} />
        </Card>
      </CardContainer>

      <ClientsChartContainer className="p-grid p-justify-around">
        <div>
          <h2>Novos clientes nos ultimos 3 meses</h2>
          <Chart
            type="line"
            data={clientChartData}
            className="p-col-12 p-lg-7"
            height="350px"
            width="750px"
          />
        </div>
        <div className="p-col-12 p-lg-5">
          <h2>Produtos mais vendidos</h2>
          <TopSellingProducts>
            <thead>
              <tr>
                <th>Produtos</th>
                <th>Quantidade vendida</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Detergente neutro</td>
                <td>980</td>
              </tr>
              <tr>
                <td>Detergente neutro</td>
                <td>980</td>
              </tr>
              <tr>
                <td>Detergente neutro</td>
                <td>980</td>
              </tr>
              <tr>
                <td>Detergente neutro</td>
                <td>980</td>
              </tr>
              <tr>
                <td>Detergente neutro</td>
                <td>980</td>
              </tr>
              <tr>
                <td>Detergente neutro</td>
                <td>980</td>
              </tr>
            </tbody>
          </TopSellingProducts>
        </div>
      </ClientsChartContainer>

      <SalesChartContainer>
        <h2>Vendas realizadas nos ultimos 12 meses</h2>
        <Chart type="bar" data={salesChartData} options={salesChartOptions} />
      </SalesChartContainer>
    </>
  );
}
