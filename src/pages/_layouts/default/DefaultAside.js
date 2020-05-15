import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiShoppingCart,
  FiUser,
  FiPackage,
  FiSettings,
} from 'react-icons/fi';
import logoImg from '../../../assets/logo-novo.png';
import userImg from '../../../assets/user-icon.png';
import { Menu, MenuHeader, MenuBody, MenuFooter } from './styles';

export default function DefaultAside() {
  return (
    <Menu>
      <MenuHeader>
        <img
          src={logoImg}
          alt="Logo Tuca distribuidora de produtos de limpeza"
        />
      </MenuHeader>
      <MenuBody>
        <ul>
          <li>
            <NavLink className="menu-link" exact to="/dashboard">
              <FiHome size={24} className="icon-menu" />
              <p>Página inicial</p>
            </NavLink>
          </li>
          <li>
            <NavLink className="menu-link" to="/sales">
              <FiShoppingCart size={24} className="icon-menu" />
              <p>Vendas</p>
            </NavLink>
          </li>
          <li>
            <NavLink className="menu-link" to="/clients">
              <FiUser size={24} className="icon-menu" />
              <p>Clientes</p>
            </NavLink>
          </li>
          <li>
            <NavLink className="menu-link" to="/products">
              <FiPackage size={24} className="icon-menu" />
              <p>Produtos</p>
            </NavLink>
          </li>
          <li>
            <NavLink className="menu-link" to="/settings">
              <FiSettings size={24} className="icon-menu" />
              <p>Configurações</p>
            </NavLink>
          </li>
        </ul>
      </MenuBody>
      <MenuFooter>
        <img
          src={userImg}
          alt="Logo Tuca distribuidora de produtos de limpeza"
        />
        <div>
          <p id="user-name">Nome usuario</p>
          <small>email@email.com</small>
        </div>
      </MenuFooter>
    </Menu>
  );
}
