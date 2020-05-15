import React from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import {
  DropdownContent,
  DropdownList,
  DropdownItem,
  List as ClientList,
} from '../../styles/table';

import ListHeader from '../../components/ListHeader';

export default function Clients() {
  const clientList = [
    {
      id: 1,
      nome: 'João vitor',
      endereco: 'Rua das bananeiras',
      complemento: '500',
      bairro: 'Rio grande',
      cidade: 'Palhoça',
      telefone: '(49) 99889-0987',
    },
    {
      id: 2,
      nome: 'Julian Robert',
      endereco: 'Rua dos passáros',
      complemento: '152 1 Andar',
      bairro: 'Rio grande',
      cidade: 'Palhoça',
      telefone: '(49) 99889-1234',
    },
    {
      id: 3,
      nome: 'Alfredo Silva',
      endereco: 'Rua Presidente Rio Branco',
      complemento: '2000',
      bairro: 'Rio grande',
      cidade: 'Palhoça',
      telefone: '(49) 99812-5768',
    },
  ];
  return (
    <div>
      <ListHeader
        btnFunction={() => {}}
        btnText="Cadastrar cliente"
        placeHolder="Digite aqui o nome do cliente"
      />

      <ClientList>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Rua</th>
            <th>Bairro</th>
            <th>Cidade</th>
            <th>Telefone</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {clientList.map(c => {
            return (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{`${c.endereco},${c.complemento}`}</td>
                <td>{c.bairro}</td>
                <td>{c.cidade}</td>
                <td>{c.telefone}</td>
                <td className="more-icon">
                  <DropdownList>
                    <FiMoreVertical size={24} />
                    <DropdownContent>
                      <DropdownItem onClick={() => {}}>
                        Visualizar compras feitas
                      </DropdownItem>
                      <DropdownItem type="button" onClick={() => {}}>
                        Editar cliente
                      </DropdownItem>
                      <DropdownItem type="button" onClick={() => {}}>
                        Excluir cliente
                      </DropdownItem>
                    </DropdownContent>
                  </DropdownList>
                </td>
              </tr>
            );
          })}
        </tbody>
      </ClientList>
    </div>
  );
}
