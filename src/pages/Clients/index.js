import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { FiMoreVertical, FiX, FiEdit, FiCheck } from 'react-icons/fi';
import { Growl } from 'primereact/growl';

import { ClientModal, ModalButtonsContainer } from '../../styles/modal';
import { PrimaryButton, SecondaryButton } from '../../styles/button';
import {
  DropdownContent,
  DropdownList,
  DropdownItem,
  List as ClientList,
} from '../../styles/table';

import ListHeader from '../../components/ListHeader';
import ConfirmModal from '../../components/ConfirmModal';

import ClientController from '../../controllers/ClientController';

export default function Clients() {
  ClientModal.setAppElement('#root');
  // const history = useHistory();
  const [modalTitle, setModalTitle] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [purchasesModalOpen, setPurchasesModalOpen] = useState(false);
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
      setModalOpen(false);
    } else {
      ClientController.create(client, growl);
      cleanUpClientObject();
      setModalOpen(false);
    }
  }

  function handleDelete(id) {
    ClientController.delete(id, growl);
    setDeleteModalOpen(false);
  }

  // Modal functions
  function closeModal() {
    /* TODO: Check if is data to save
     * {...}
     */

    setModalOpen(false);
    cleanUpClientObject();
  }

  function openModal(c) {
    // If client is null add a new one, otherwise edit
    if (!c) {
      setModalTitle('Cadastrar novo cliente');
      setModalOpen(true);
    } else {
      setModalTitle('Editar Cliente');
      setClient(c);
      setModalOpen(true);
    }
  }

  function toogleDeleteModal(c) {
    cleanUpClientObject();
    if (c) {
      setClient(c);
      setDeleteModalOpen(true);
    } else {
      setDeleteModalOpen(false);
    }
  }

  function tooglePurchasesModal(c) {
    cleanUpClientObject();
    if (c) {
      setClient(c);
      setPurchasesModalOpen(!purchasesModalOpen);
    } else {
      setPurchasesModalOpen(false);
    }
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
        isOpen={modalOpen}
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
        isOpen={deleteModalOpen}
        title="Excluir cliente"
        msg={`Deseja realmente excluir o cliente ${client.nome}?`}
        handleClose={() => toogleDeleteModal(null)}
        handleConfirm={() => handleDelete(client.id)}
      />
    </div>
  );
}
