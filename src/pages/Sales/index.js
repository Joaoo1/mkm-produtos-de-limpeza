import React, { useState, useEffect } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import SaleController from '../../controllers/SaleController';

import { SaleModal } from '../../styles/modal';
import {
  List as SalesList,
  DropdownContent,
  DropdownList,
  DropdownItem,
} from '../../styles/table';

import ListHeader from '../../components/ListHeader';
import ConfirmModal from '../../components/ConfirmModal';

export default function Sales() {
  SaleModal.setAppElement('#root');
  const history = useHistory();

  const [salesList, setSalesList] = useState([]);
  const [sale, setSale] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    async function fetchSales() {
      const sales = SaleController.index();
      setTimeout(() => setSalesList(sales), 2000);
    }
    fetchSales();
  }, []);

  function toggleDeleteModal(s) {
    setSale({});
    if (s) {
      setSale(s);
      setDeleteModalOpen(true);
    } else {
      setDeleteModalOpen(false);
    }
  }

  function handleHistory(data) {
    history.push(data);
  }

  function handleDelete(sale1) {
    SaleController.delete(sale1);
  }

  return (
    <div>
      <ListHeader
        btnFunction={() => {
          history.push({
            pathname: '/sales/add',
            data: { pageTitle: 'Registrar venda' },
          });
        }}
        btnText="Registrar venda"
        placeHolder="Digite aqui o ID da venda"
        filterEnabled
      />

      <SalesList>
        <thead>
          <tr>
            <th>ID da Venda</th>
            <th>Valor</th>
            <th>Data</th>
            <th>Cliente</th>
            <th>Situação</th>
            <th className="products">Produtos</th>
            <th> </th>
          </tr>
        </thead>

        <tbody>
          {salesList &&
            Array.isArray(salesList) &&
            salesList.map(el => (
              <tr key={el.idVenda}>
                <td>{el.idVenda}</td>
                <td>
                  R$
                  {el.valorLiquido}
                </td>
                <td>{el.dataVenda}</td>
                <td>{el.nomeCliente}</td>
                <td>{el.situation}</td>
                <td className="products">
                  {el.products &&
                    el.products.map(product => (
                      <p key={product.nome}>
                        {`${product.quantidade}x ${product.nome}`}
                      </p>
                    ))}
                </td>
                <td className="more-icon">
                  <DropdownList>
                    <FiMoreVertical size={24} />
                    <DropdownContent>
                      <DropdownItem>Mudar situação para pago</DropdownItem>
                      <DropdownItem
                        onClick={() => {
                          handleHistory({
                            pathname: '/sales/add',
                            data: {
                              pageTitle: 'Editar venda',
                              sale: el,
                            },
                          });
                        }}
                      >
                        Editar venda
                      </DropdownItem>
                      <DropdownItem onClick={() => toggleDeleteModal(el)}>
                        Excluir venda
                      </DropdownItem>
                    </DropdownContent>
                  </DropdownList>
                </td>
              </tr>
            ))}
        </tbody>
      </SalesList>

      {/* Confirm delete modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Excluir venda"
        msg={`Deseja realmente excluir a venda ${sale.idVenda}?`}
        handleClose={() => toggleDeleteModal(null)}
        handleConfirm={() => handleDelete(sale.id)}
      />
    </div>
  );
}
