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
      <RouteWrapper path="/dashboard" component={Dashboard} isPrivate />
      <RouteWrapper path="/sales" exact component={Sales} isPrivate />
      <RouteWrapper path="/sales/add" component={AddSales} isPrivate />
      <RouteWrapper path="/sales/edit" component={EditSales} isPrivate />
      <RouteWrapper path="/clients" component={Clients} isPrivate />
      <RouteWrapper path="/products" component={Products} isPrivate />
      <RouteWrapper path="/settings" component={Settings} isPrivate />
    </Switch>
  );
}
