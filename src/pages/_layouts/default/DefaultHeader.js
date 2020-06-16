import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import { Header } from './styles';
import Authentication from '../../../server/Authentication';

const propTypes = {
  title: PropTypes.string.isRequired,
};

export default function DefaultHeader({ title }) {
  const history = useHistory();

  function handleLogout() {
    Authentication.LogOut();
  }
  return (
    <Header>
      <h1>{title}</h1>
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

DefaultHeader.propTypes = propTypes;
