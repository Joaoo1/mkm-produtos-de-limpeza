import React, { useState, useEffect, useRef } from 'react';
import { FiMoreVertical, FiPrinter } from 'react-icons/fi';
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
import { FloatingButton } from '../../styles/button';
import { PaymentSituation } from './styles';

import ListHeader from '../../components/ListHeader';
import ConfirmModal from '../../components/ConfirmModal';

import { successMsg, infoMsg } from '../../helpers/Growl';
import { savePDF, REPORT_SALES } from '../../helpers/SavePDF';

export default function Sales() {
  const growl = useRef(null);

  SaleModal.setAppElement('#root');

  const history = useHistory();

  const [salesList, setSalesList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [sale, setSale] = useState({});
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  async function fetchSales() {
    const sales = await SaleController.index(100);
    setSalesList(sales);
    setFilteredList(sales);
  }

  useEffect(() => {
    fetchSales();
  }, []);

  function filterList(event) {
    setFilteredList(
      salesList.filter(sale =>
        sale.saleId.toString().includes(event.target.value)
      )
    );
  }
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
    state.grossValue = state.grossValue ? state.grossValue.toFixed(2) : '0.00';
    state.netValue = state.netValue ? state.netValue.toFixed(2) : '0.00';
    state.paidValue = state.paidValue ? state.paidValue.toFixed(2) : '0.00';
    state.valueToReceive = state.valueToReceive
      ? state.valueToReceive.toFixed(2)
      : '0.00';
    state.discount = state.discount ? state.discount.toFixed(2) : '0.00';
    state.products = state.products.map(p => {
      return { ...p, price: p.price.toFixed(2) };
    });
    history.push({ pathname, state });
  }

  function handleDelete(sale, saleId) {
    SaleController.delete(sale, saleId).then(() => {
      successMsg(growl, 'Venda excluida com sucesso');
      fetchSales();
      toggleDeleteModal();
    });
  }

  function changeSaleSituation(sale) {
    if (sale.paid) {
      infoMsg(growl, 'Esta venda já foi finalizada');
      return;
    }
    infoMsg(growl, 'Processando, aguarde um momento!');

    SaleController.update(sale, true).then(() => {
      fetchSales();
      successMsg(growl, 'Venda finalizada com sucesso');
    });
  }

  function generateReport() {
    savePDF(REPORT_SALES, salesList);
  }

  return (
    <>
      <FloatingButton>
        <FiPrinter size={30} color="white" onClick={generateReport} />
      </FloatingButton>
      <Growl ref={growl} />
      <ListHeader
        btnFunction={() => {
          history.push({
            pathname: '/sales/add',
          });
        }}
        btnText="Registrar venda"
        placeHolder="Digite aqui o ID da venda"
        filterList={filterList}
        filterEnabled
        filterButtonFunction={sales => {
          setSalesList(sales);
          setFilteredList(sales);
        }}
      />

      <SalesList id="sales-list">
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
          {filteredList &&
            Array.isArray(filteredList) &&
            filteredList.map(sale => (
              <tr key={sale.saleId}>
                <td>{sale.saleId}</td>
                <td>
                  R$
                  {sale.netValue.toFixed(2)}
                </td>
                <td>{sale.saleDate}</td>
                <td>{sale.client.name}</td>
                <PaymentSituation situation={sale.situation}>
                  {sale.situation}
                </PaymentSituation>
                <td className="products">
                  {sale.products &&
                    sale.products.map(product => (
                      <p key={sale.id + product.name}>
                        {`${product.quantity}x ${product.name}`}
                      </p>
                    ))}
                </td>
                <td className="more-icon">
                  <DropdownList>
                    <FiMoreVertical size={24} />
                    <DropdownContent>
                      <DropdownItem onClick={() => changeSaleSituation(sale)}>
                        Alterar situação de pagamento
                      </DropdownItem>
                      <DropdownItem
                        onClick={() => handleHistory('/sales/edit', sale)}
                      >
                        Editar venda
                      </DropdownItem>
                      <DropdownItem onClick={() => toggleDeleteModal(sale)}>
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
        msg={`Deseja realmente excluir a venda ${sale.saleId}?`}
        handleClose={() => toggleDeleteModal(null)}
        handleConfirm={() => handleDelete(sale.id, sale.saleId)}
      />
    </>
  );
}
