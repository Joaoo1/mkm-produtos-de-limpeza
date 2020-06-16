import React from 'react';
import { Switch, Route } from 'react-router-dom';
import RouteWrapper from './Route';

import Login from '../pages/Login';

import Dashboard from '../pages/Dashboard';
import Sales from '../pages/Sales';
import AddSales from '../pages/AddSales';
import EditSales from '../pages/EditSales';
import Clients from '../pages/Clients';
import Products from '../pages/Products';
import Settings from '../pages/Settings';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Login} />
      <RouteWrapper
        path="/dashboard"
        component={Dashboard}
        title="Página inicial"
        isPrivate
      />
      <RouteWrapper
        path="/sales"
        exact
        component={Sales}
        isPrivate
        title="Vendas"
      />
      <RouteWrapper
        path="/sales/add"
        component={AddSales}
        isPrivate
        title="Vendas"
      />
      <RouteWrapper
        path="/sales/edit"
        component={EditSales}
        isPrivate
        title="Vendas"
      />
      <RouteWrapper
        path="/clients"
        component={Clients}
        isPrivate
        title="Clientes"
      />
      <RouteWrapper
        path="/products"
        component={Products}
        isPrivate
        title="Produtos"
      />
      <RouteWrapper
        path="/settings"
        component={Settings}
        isPrivate
        title="Configurações"
      />
    </Switch>
  );
}
