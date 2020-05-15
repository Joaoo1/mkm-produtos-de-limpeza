import React from 'react';
import { useHistory } from 'react-router-dom';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import { Header } from './styles';
import Authentication from '../../../server/Authentication';

export default function DefaultHeader() {
  const history = useHistory();

  function handleLogout() {
    Authentication.LogOut();
  }
  return (
    <Header>
      <h1>Title</h1>
      <div className="header-icons">
        <FiSettings
          size={32}
          title="Configurações"
          onClick={() => history.push('/settings')}
        />
        <FiLogOut size={32} title="Sair do sistema" onClick={handleLogout} />
      </div>
    </Header>
  );
}
