import React, { useEffect, useState, useRef } from 'react';
import moment from 'moment';
import { Chart } from 'primereact/chart';
import { FiDollarSign, FiPackage, FiUsers, FiRefreshCw } from 'react-icons/fi';
import { Growl } from 'primereact/growl';

import { successMsg, infoMsg, errorMsg } from '../../helpers/Growl';
import DashboardController from '../../controllers/DashboardController';
import {
  // TopSellingProducts,
  CardContainer,
  Card,
  SalesChartContainer,
  ClientsChartContainer,
  UpdatedAt,
  RefreshInfo,
  Welcome,
} from './styles';

export default function Dashboard() {
  const growl = useRef(null);

  const [salesLast12Months, setSalesLast12Months] = useState({});
  const [generalInfo, setGeneralInfo] = useState({});

  useEffect(() => {
    async function fetchGeneralInfo() {
      const data = await DashboardController.getGeneralinfo();
      setGeneralInfo(data);
    }
    fetchGeneralInfo();
    async function fetchSalesLast12Months() {
      const data = await DashboardController.getSalesFromLast12Months();
      setSalesLast12Months(data);
    }
    fetchSalesLast12Months();
  }, []);

  /* const clientChartData = {
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
  }; */
  function updateGeneralInfo() {
    try {
      infoMsg(growl, 'Atualizando informações gerais');
      DashboardController.getGeneralinfo(true).then(data => {
        setGeneralInfo(data);
        successMsg(growl, 'Atualizado com sucesso!');
      });
    } catch (err) {
      errorMsg(growl, 'Erro ao carregar informações');
    }
  }
  // Sales from last 12 months
  function updateSalesLast12Months() {
    try {
      infoMsg(growl, 'Processando requisição');
      DashboardController.getSalesFromLast12Months(true).then(sales => {
        setSalesLast12Months({
          updatedAt: moment(new Date()).format('DD/MM HH:mm'),
          salesByMonth: sales.data,
        });
        successMsg(growl, 'Atualizado com sucesso!');
      });
    } catch (err) {
      errorMsg(growl, 'Ocorreu um erro ao carregar vendas');
    }
  }
  const salesChartData = {
    labels: salesLast12Months.salesByMonth
      ? salesLast12Months.salesByMonth.map(obj => obj.month)
      : [],

    datasets: [
      {
        type: 'bar',
        label: 'Vendas',
        backgroundColor: '#1859ad',
        // data: [340, 213, 132, 465, 345, 432, 123, 678, 467, 574, 267, 734],
        data: salesLast12Months.salesByMonth
          ? salesLast12Months.salesByMonth.map(obj => obj.sales)
          : [],
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
      <Growl ref={growl} />
      <header className="p-grid p-justify-between">
        <Welcome>
          <p>Seja bem-vindo</p>
        </Welcome>
        <RefreshInfo>
          <div className="flex-nowrap">
            <p>Atualizar Informações</p>
            <FiRefreshCw size={28} onClick={updateGeneralInfo} />
          </div>
          <UpdatedAt>
            {generalInfo.updatedAt
              ? `Atualizado em ${generalInfo.updatedAt}`
              : ''}
          </UpdatedAt>
        </RefreshInfo>
      </header>
      <CardContainer className="p-grid">
        <Card className="p-col-12 p-md-3">
          <div>
            <p className="card-title">Vendas</p>
            <p className="card-value">
              {generalInfo.sales ? (
                generalInfo.sales
              ) : (
                <small>Carregando...</small>
              )}
            </p>
            <small>Número total de vendas</small>
            {/* <small>20% a mais que mês passado</small> */}
          </div>
          <FiDollarSign size={40} />
        </Card>
        <Card className="p-col-12 p-md-3">
          <div>
            <p className="card-title">Clientes</p>
            <p className="card-value">
              {generalInfo.clients ? (
                generalInfo.clients
              ) : (
                <small>Carregando...</small>
              )}
            </p>
            <small>Número total de clientes</small>
            {/* <small>20% a mais que mês passado</small> */}
          </div>
          <FiUsers size={40} />
        </Card>
        <Card className="p-col-12 p-md-3">
          <div>
            <p className="card-title">Produtos</p>
            <p className="card-value">
              {generalInfo.products ? (
                generalInfo.products
              ) : (
                <small>Carregando...</small>
              )}
            </p>
            <small>Número total de produtos</small>
            {/* <small>20% a mais que mês passado</small> */}
          </div>
          <FiPackage size={40} />
        </Card>
      </CardContainer>

      <SalesChartContainer>
        <div className="p-grid p-justify-between">
          <h2>Vendas realizadas nos ultimos 12 meses</h2>
          <div className="p-grid p-dir-col p-align-end">
            <FiRefreshCw size={30} onClick={updateSalesLast12Months} />
            <UpdatedAt>
              {salesLast12Months.updatedAt
                ? `Atualizado em ${salesLast12Months.updatedAt}`
                : ''}
            </UpdatedAt>
          </div>
        </div>
        <Chart type="bar" data={salesChartData} options={salesChartOptions} />
      </SalesChartContainer>

      <ClientsChartContainer className="p-grid p-justify-around">
        <div>
          <h2>Novos clientes nos ultimos 3 meses</h2>
          <h3 className="p-grid p-align-center p-justify-center">
            Indisponivel
          </h3>
          {/* <Chart
            type="line"
            data={clientChartData}
            className="p-col-12 p-lg-7"
            height="350px"
            width="750px"
          /> */}
        </div>
        <div className="p-col-12 p-lg-5">
          <h2>Produtos mais vendidos</h2>
          <h3 className="p-grid p-align-center p-justify-center">
            Indisponivel
          </h3>
          {/* <TopSellingProducts> 
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
          </TopSellingProducts> */}
        </div>
      </ClientsChartContainer>
    </>
  );
}
