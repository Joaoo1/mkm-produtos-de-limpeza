import React, { useState, useEffect } from 'react';
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

export default function Clients() {
  ClientModal.setAppElement('#root');
  const [modalTitle, setModalTitle] = useState('');
  const [modalOpen, setModalOpen] = useState({
    addEditModal: false,
    deleteModal: false,
    purchasesMadeModal: false,
  });
  const [client, setClient] = useState({});
  const [clientList, setClientList] = useState([]);
  let growl = {};

  function cleanUpClientObject() {
    setClient({
      bairro: '',
      cidade: '',
      endereco: '',
      complemento: '',
      nome: '',
      telefone: '',
      id: '',
    });
  }

  useEffect(() => {
    async function fetchProducts() {
      const clients = await ClientController.index();
      setClientList(clients);
    }
    fetchProducts();
  }, []);

  function setGrowl(el) {
    growl = el;
  }
  // Function used to both create and edit
  function handleSave(isUpdate) {
    if (isUpdate) {
      ClientController.update(client, growl);
      setModalOpen({ ...modalOpen, addEditModal: false });
    } else {
      ClientController.create(client, growl);
      cleanUpClientObject();
      setModalOpen({ ...modalOpen, addEditModal: false });
    }
  }

  function handleDelete(id) {
    ClientController.delete(id, growl);
    setModalOpen({ ...modalOpen, deleteModal: false });
  }

  // Modal functions
  function closeModal() {
    /**
     * TODO: Check if is data to save
     */

    setModalOpen(false);
    cleanUpClientObject();
  }

  function openModal(c) {
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
    cleanUpClientObject();
    if (c) {
      setClient(c);
      setModalOpen({ ...modalOpen, deleteModal: true });
    } else {
      setModalOpen({ ...modalOpen, deleteModal: false });
    }
  }

  function tooglePurchasesModal(c) {
    cleanUpClientObject();
    if (c) {
      setClient(c);
      setModalOpen({ ...modalOpen, purchasesMadeModal: true });
    } else {
      setModalOpen({ ...modalOpen, purchasesMadeModal: true });
    }
  }

  function handleClosePurchasesModal() {
    cleanUpClientObject();
    setModalOpen({ ...modalOpen, purchasesMadeModal: false });
  }
  return (
    <div>
      <Growl ref={el => setGrowl(el)} />

      <ListHeader
        btnFunction={() => openModal()}
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
        onRequestClose={handleClosePurchasesModal}
        overlayClassName="modal-overlay"
      >
        <header className="p-grid p-nogutter p-justify-between">
          <h2>{`Compras feitas por ${client.nome}`}</h2>
          <FiX size={28} onClick={handleClosePurchasesModal} />
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
            <tr>
              <td>9999</td>
              <td>10/02/2020</td>
              <td>R$20.00</td>
              <td>NÃO PAGO</td>
              <td>
                <div className="p-grid p-dir-col">
                  <p>1x Desifentante</p>
                  <p>2x Desifentante</p>
                  <p>1x Amaciante</p>
                </div>
              </td>
              <td>
                <div className="p-grid p-dir-col p-justify-around p-nogutter">
                  <FiCheckSquare
                    size={26}
                    color="green"
                    title="Mudar situação para pago"
                  />
                  <br />
                  <FiEdit size={24} title="Editar venda" />
                </div>
              </td>
            </tr>
          </tbody>
        </PurchasesMadeList>
      </PurchasesMadeModal>
    </div>
  );
}
