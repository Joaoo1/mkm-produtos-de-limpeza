import React, { useState, useEffect, useRef } from 'react';
import Big from 'big.js';
import { FiMoreVertical } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import { Growl } from 'primereact/growl';
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

import { successMsg } from '../../helpers/Growl';

export default function Sales() {
  const growl = useRef(null);

  SaleModal.setAppElement('#root');

  const history = useHistory();

  const [salesList, setSalesList] = useState([]);
  const [sale, setSale] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  async function fetchSales() {
    const sales = await SaleController.index(100);
    setSalesList(sales);
  }

  useEffect(() => {
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

  function handleHistory(pathname, state) {
    state.valorBruto = state.valorBruto
      ? (state.valorBruto = state.valorBruto.toFixed(2))
      : new Big(0);
    state.valorLiquido = state.valorLiquido
      ? (state.valorLiquido = state.valorLiquido.toFixed(2))
      : new Big(0);
    state.valorPago = state.valorPago
      ? (state.valorPago = state.valorPago.toFixed(2))
      : new Big(0);
    state.valorAReceber = state.valorAReceber
      ? (state.valorAReceber = state.valorAReceber.toFixed(2))
      : new Big(0);
    state.desconto = state.desconto
      ? (state.desconto = state.desconto.toFixed(2))
      : new Big(0);
    history.push({ pathname, state });
  }

  function handleDelete(sale, idVenda) {
    SaleController.delete(sale, idVenda).then(() => {
      successMsg(growl, 'Venda excluida com sucesso');
      fetchSales();
    });
  }

  return (
    <div>
      <Growl ref={growl} />
      <ListHeader
        btnFunction={() => {
          history.push({
            pathname: '/sales/add',
          });
        }}
        btnText="Registrar venda"
        placeHolder="Digite aqui o ID da venda"
        filterList={() => {}}
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
                  {el.valorLiquido.toFixed(2)}
                </td>
                <td>{el.dataVenda}</td>
                <td>{el.nomeCliente}</td>
                <td>{el.situation}</td>
                <td className="products">
                  {el.products &&
                    el.products.map(product => (
                      <p key={product.id}>
                        {`${product.quantidade}x ${product.nome}`}
                      </p>
                    ))}
                </td>
                <td className="more-icon">
                  <DropdownList>
                    <FiMoreVertical size={24} />
                    <DropdownContent>
                      <DropdownItem>Alterar situação de pagamento</DropdownItem>
                      <DropdownItem
                        onClick={() => handleHistory('/sales/edit', el)}
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
        handleConfirm={() => handleDelete(sale.id, sale.idVenda)}
      />
    </div>
  );
}
