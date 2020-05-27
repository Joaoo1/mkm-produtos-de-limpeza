import React, { useState, useEffect, useRef } from 'react';
import { FiMoreVertical, FiX, FiCheckSquare, FiEdit } from 'react-icons/fi';
import { Growl } from 'primereact/growl';

import {
  PurchasesMadeModal,
  ClientModal,
  ModalButtonsContainer,
} from '../../styles/modal';
import { PrimaryButton, SecondaryButton } from '../../styles/button';
import {
  DropdownContent,
  DropdownList,
  DropdownItem,
  List as ClientList,
} from '../../styles/table';

import { PurchasesMadeList } from './styles';

import ListHeader from '../../components/ListHeader';
import ConfirmModal from '../../components/ConfirmModal';

import ClientController from '../../controllers/ClientController';
import ClientSalesController from '../../controllers/ClientSalesController';
import SaleController from '../../controllers/SaleController';

import Client from '../../models/Client';

export default function Clients() {
  const growl = useRef(null);

  ClientModal.setAppElement('#root');
  const [modalTitle, setModalTitle] = useState('');
  const [modalOpen, setModalOpen] = useState({
    addEditModal: false,
    deleteModal: false,
    purchasesMadeModal: false,
  });

  const [client, setClient] = useState(new Client({}));
  const [clientList, setClientList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [clientSalesList, setClientSalesList] = useState([]);

  async function fetchClients() {
    const clients = await ClientController.index();
    setClientList(clients);
    setFilteredList(clients);
  }

  useEffect(() => {
    fetchClients();
  }, []);

  function filterList(event) {
    setFilteredList(
      clientList.filter(c =>
        c.nome.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
  }

  // Modal functions
  function closeModal() {
    setModalOpen({ ...modalOpen, addEditModal: false });
    client.cleanUp();
  }

  function openModal(c) {
    client.cleanUp();
    // If client is null add a new one, otherwise edit
    if (!c) {
      setModalTitle('Cadastrar novo cliente');
      setModalOpen({ ...modalOpen, addEditModal: true });
    } else {
      setModalTitle('Editar Cliente');
      setClient(c);
      setModalOpen({ ...modalOpen, addEditModal: true });
    }
  }

  function toogleDeleteModal(c) {
    client.cleanUp();
    if (c) {
      setClient(c);
      setModalOpen({ ...modalOpen, deleteModal: true });
    } else {
      setModalOpen({ ...modalOpen, deleteModal: false });
    }
  }

  async function tooglePurchasesModal(c) {
    client.cleanUp();
    if (c) {
      setClient(c);
      const a = await ClientSalesController.index(c.id);
      setClientSalesList(a);
      setModalOpen({ ...modalOpen, purchasesMadeModal: true });
    } else {
      setModalOpen({ ...modalOpen, purchasesMadeModal: false });
    }
  }

  /**
   * CRUD Functions
   */

  function validateForm() {
    if (client.nome.length === 0) {
      growl.current.show({
        severity: 'error',
        summary: 'Digite o nome do cliente',
      });
      return false;
    }

    return true;
  }

  // Function used to both create and edit
  function handleSave(isUpdate) {
    if (!validateForm()) {
      return;
    }

    if (isUpdate) {
      ClientController.update(client).then(
        () => {
          fetchClients();
          growl.current.show({
            severity: 'success',
            summary: 'Cliente atualizado com sucesso',
          });
        },
        () =>
          growl.current.show({
            severity: 'error',
            summary: `Ocorreu um erro ao atualizar cliente`,
          })
      );
    } else {
      ClientController.create(client).then(
        () => {
          fetchClients();
          growl.current.show({
            severity: 'success',
            summary: 'Cliente adicionado com sucesso',
          });
        },
        () =>
          growl.current.show({
            severity: 'error',
            summary: `Ocorreu um erro ao adicionar cliente`,
          })
      );
    }
    closeModal();
  }

  function handleDelete(id) {
    ClientController.delete(id).then(
      () => {
        fetchClients();
        growl.current.show({
          severity: 'success',
          summary: 'Cliente excluido com sucesso',
        });
      },

      () =>
        growl.current.show({
          severity: 'error',
          summary: `Ocorreu um erro ao excluir cliente`,
        })
    );
    setModalOpen({ ...modalOpen, deleteModal: false });
  }

  function changeSaleSituation(sale, index) {
    if (sale.pago) {
      growl.current.show({
        severity: 'info',
        summary: 'Esta venda já foi finalizada',
      });

      return;
    }
    // Saving id because it will be deleted in the controller
    const { id } = sale;

    sale.valorAReceber = '0.00';
    sale.valorPago = sale.valorLiquido;
    sale.pago = true;

    SaleController.update(sale).then(
      () => {
        const newList = clientSalesList.map((s, idx) => {
          if (idx === index) {
            sale.situation = 'PAGO';
            sale.id = id;
            return sale;
          }
          return s;
        });
        setClientSalesList(newList);
        growl.current.show({
          severity: 'success',
          summary: 'Venda finalizada com sucesso',
        });
      },
      () => {
        growl.current.show({
          severity: 'error',
          summary: 'Ocorreu um erro ao finalizar venda',
        });
      }
    );
  }

  return (
    <div>
      <Growl ref={growl} />

      <ListHeader
        btnFunction={() => openModal()}
        btnText="Cadastrar cliente"
        filterList={filterList}
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
          {filteredList.map(c => {
            return (
              <tr key={c.id}>
                <td>{c.nome}</td>
                <td>{`${c.endereco}, ${c.complemento}`}</td>
                <td>{c.bairro}</td>
                <td>{c.cidade}</td>
                <td>{c.telefone}</td>
                <td className="more-icon">
                  <DropdownList>
                    <FiMoreVertical size={24} />
                    <DropdownContent>
                      <DropdownItem onClick={() => tooglePurchasesModal(c)}>
                        Visualizar compras feitas
                      </DropdownItem>
                      <DropdownItem onClick={() => openModal(c)}>
                        Editar cliente
                      </DropdownItem>
                      <DropdownItem onClick={() => toogleDeleteModal(c)}>
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

      {/* Add/edit modal */}
      <ClientModal
        isOpen={modalOpen.addEditModal}
        onRequestClose={closeModal}
        closeTimeoutMS={450}
        overlayClassName="modal-overlay"
      >
        <h2>{modalTitle}</h2>
        <hr />

        <p>Nome</p>
        <input
          value={client.nome}
          onChange={e => setClient({ ...client, nome: e.target.value })}
        />

        <p>Rua</p>
        <input
          value={client.endereco}
          onChange={e => setClient({ ...client, endereco: e.target.value })}
        />

        <p>Complemento</p>
        <input
          value={client.complemento}
          onChange={e => setClient({ ...client, complemento: e.target.value })}
        />

        <p>Bairro</p>
        <input
          value={client.bairro}
          onChange={e => setClient({ ...client, bairro: e.target.value })}
        />

        <div className="input-city-container">
          <div>
            <p>Cidade</p>
            <input
              value={client.cidade}
              onChange={e => setClient({ ...client, cidade: e.target.value })}
            />
          </div>
          <div>
            <p>Telefone</p>
            <input
              value={client.telefone}
              onChange={e => setClient({ ...client, telefone: e.target.value })}
            />
          </div>
        </div>

        <ModalButtonsContainer>
          <SecondaryButton
            type="button"
            className="button-common background-gray"
            onClick={() => closeModal()}
          >
            Fechar
          </SecondaryButton>

          <PrimaryButton
            type="button"
            className="button-common"
            onClick={() => handleSave(client.id)}
          >
            Salvar
          </PrimaryButton>
        </ModalButtonsContainer>
      </ClientModal>

      {/* Confirm delete modal */}
      <ConfirmModal
        isOpen={modalOpen.deleteModal}
        title="Excluir cliente"
        msg={`Deseja realmente excluir o cliente ${client.nome}?`}
        handleClose={() => toogleDeleteModal(null)}
        handleConfirm={() => handleDelete(client.id)}
      />

      {/* Purchases made modal */}
      <PurchasesMadeModal
        isOpen={modalOpen.purchasesMadeModal}
        onRequestClose={() => tooglePurchasesModal(null)}
        overlayClassName="modal-overlay"
      >
        <header className="p-grid p-nogutter p-justify-between">
          <h2>{`Compras feitas por ${client.nome}`}</h2>
          <FiX size={28} onClick={() => tooglePurchasesModal(null)} />
        </header>
        <hr />
        <PurchasesMadeList>
          <thead>
            <tr>
              <th>ID da Venda</th>
              <th>Data</th>
              <th>Valor Total</th>
              <th>Situação</th>
              <th colSpan="2">Produtos</th>
            </tr>
          </thead>
          <tbody>
            {clientSalesList &&
              clientSalesList.map((sale, idx) => {
                return (
                  <tr key={sale.id}>
                    <td className="sale-id">{sale.idVenda}</td>
                    <td>{sale.dataVenda}</td>
                    <td>{`R$${sale.valorLiquido}`}</td>
                    <td>{sale.situation}</td>
                    <td>
                      <div className="p-grid p-dir-col">
                        {sale.products &&
                          sale.products.map(product => {
                            return (
                              <p key={product.id}>
                                {`${product.quantidade}x ${product.nome}`}
                              </p>
                            );
                          })}
                      </div>
                    </td>
                    <td>
                      <div className="p-grid p-dir-col p-justify-around p-nogutter">
                        <FiCheckSquare
                          size={26}
                          color="green"
                          title="Mudar situação para pago"
                          onClick={() => changeSaleSituation(sale, idx)}
                        />
                        <br />
                        <FiEdit size={24} title="Editar venda" />
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </PurchasesMadeList>
      </PurchasesMadeModal>
    </div>
  );
}
