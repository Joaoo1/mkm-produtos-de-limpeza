import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { FiMoreVertical, FiX, FiCheckSquare, FiEdit } from 'react-icons/fi';
import { Growl } from 'primereact/growl';
import { AutoComplete } from 'primereact/autocomplete';
import { InputText } from 'primereact/inputtext';
import { successMsg, errorMsg, infoMsg } from '../../helpers/Growl';

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

import {
  SALE_CLIENT_NAME,
  SALE_CLIENT_STREET,
  SALE_CLIENT_NEIGHBORHOOD,
  SALE_CLIENT_CITY,
  SALE_CLIENT_COMPLEMENT,
  SALE_CLIENT_PHONE,
} from '../../constants/firestore';

import ClientController from '../../controllers/ClientController';
import ClientSalesController from '../../controllers/ClientSalesController';
import SaleController from '../../controllers/SaleController';
import StreetController from '../../controllers/StreetController';
import NeighborhoodController from '../../controllers/NeighborhoodController';
import CityController from '../../controllers/CityController';

import Client from '../../models/Client';

export default function Clients() {
  const growl = useRef(null);
  const history = useHistory();

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

  const [addresses, setAddresses] = useState({
    streets: [],
    neighborhoods: [],
    cities: [],
  });

  const [streetSuggestions, setStreetSuggestions] = useState([]);
  const [neighborhoodSuggestions, setNeighborhoodSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);

  async function fetchClients() {
    const clients = await ClientController.index();
    setClientList(clients);
    setFilteredList(clients);
  }

  async function fetchAddresses() {
    const promiseStreet = await StreetController.index();
    const promiseNeighborhood = await NeighborhoodController.index();
    const promiseCity = await CityController.index();
    Promise.all([promiseStreet, promiseNeighborhood, promiseCity]).then(
      response => {
        const allStreets = response[0].map(street => street.name);
        const allNeighborhoods = response[1].map(
          neighborhood => neighborhood.name
        );
        const allCities = response[2].map(city => city.name);
        setAddresses({
          streets: allStreets,
          neighborhoods: allNeighborhoods,
          cities: allCities,
        });
      }
    );
  }

  useEffect(() => {
    fetchClients();
  }, []);

  function filterList(event) {
    setFilteredList(
      clientList.filter(client =>
        client.name.toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
  }

  // Handle addresses suggestions
  function suggestsStreets(event) {
    const suggestionResults = addresses.streets.filter(street =>
      street.toLowerCase().startsWith(event.query.toLowerCase())
    );

    setStreetSuggestions(suggestionResults);
  }

  function suggestsNeighborhoods(event) {
    const suggestionResults = addresses.neighborhoods.filter(neighborhood =>
      neighborhood.toLowerCase().startsWith(event.query.toLowerCase())
    );

    setNeighborhoodSuggestions(suggestionResults);
  }

  function suggestsCities(event) {
    const suggestionResults = addresses.cities.filter(cities =>
      cities.toLowerCase().startsWith(event.query.toLowerCase())
    );

    setCitySuggestions(suggestionResults);
  }

  // Modal functions
  function closeModal() {
    setModalOpen({ ...modalOpen, addEditModal: false });
  }

  function openModal(c) {
    if (
      addresses.streets.length === 0 ||
      addresses.neighborhoods.length === 0 ||
      addresses.cities.length === 0
    ) {
      fetchAddresses();
    }
    if (!c) {
      // If client is null add a new one, otherwise edit
      setClient(new Client({}));
      setModalTitle('Cadastrar novo cliente');
      setModalOpen({ ...modalOpen, addEditModal: true });
    } else {
      setModalTitle('Editar Cliente');
      setClient(c);
      setModalOpen({ ...modalOpen, addEditModal: true });
    }
  }

  function toogleDeleteModal(c) {
    if (c) {
      setClient(c);
      setModalOpen({ ...modalOpen, deleteModal: true });
    } else {
      setModalOpen({ ...modalOpen, deleteModal: false });
    }
  }

  async function tooglePurchasesModal(c) {
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
    if (client.name.length === 0) {
      errorMsg(growl, 'Digite o nome do cliente');
      return false;
    }

    if (
      client.street.length > 0 &&
      !addresses.streets.includes(client.street)
    ) {
      errorMsg(growl, 'Rua não encontrada');
      return false;
    }

    if (
      client.neighborhood.length > 0 &&
      !addresses.neighborhoods.includes(client.neighborhood)
    ) {
      errorMsg(growl, 'Bairro não encontrado');
      return false;
    }

    if (client.city.length > 0 && !addresses.cities.includes(client.city)) {
      errorMsg(growl, 'Cidade não encontrada');
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
          const toUpdate = {
            [SALE_CLIENT_NAME]: client.name,
            [SALE_CLIENT_STREET]: client.street,
            [SALE_CLIENT_COMPLEMENT]: client.complement,
            [SALE_CLIENT_NEIGHBORHOOD]: client.neighborhood,
            [SALE_CLIENT_CITY]: client.city,
            [SALE_CLIENT_PHONE]: client.phone,
          };
          ClientSalesController.update(client.id, toUpdate);
          successMsg(growl, 'Cliente atualizado com sucesso');
        },
        () => errorMsg(growl, 'Ocorreu um erro ao atualizar cliente')
      );
    } else {
      ClientController.create(client).then(
        () => {
          fetchClients();
          successMsg(growl, 'Cliente adicionado com sucesso');
        },
        () => errorMsg(growl, 'Ocorreu um erro ao adicionar cliente')
      );
    }
    closeModal();
  }

  function handleDelete(id) {
    ClientController.delete(id).then(
      () => {
        fetchClients();
        successMsg(growl, 'Cliente excluido com sucesso');
      },

      () => errorMsg(growl, 'Ocorreu um erro ao excluir cliente')
    );

    setModalOpen({ ...modalOpen, deleteModal: false });
  }

  function changeSaleSituation(sale) {
    if (sale.paid) {
      infoMsg(growl, 'Esta venda já foi finalizada');
      return;
    }
    infoMsg(growl, 'Processando, aguarde um momento!');

    SaleController.update(sale, true).then(
      async () => {
        const newList = await ClientSalesController.index(client.id);
        setClientSalesList(newList);
        successMsg(growl, 'Venda finalizada com sucesso');
      },
      error => {
        errorMsg(growl, error);
      }
    );
  }

  function editSale(s) {
    s.grossValue = s.grossValue ? s.grossValue.toFixed(2) : '0.00';
    s.netValue = s.netValue ? s.netValue.toFixed(2) : '0.00';
    s.paidValue = s.paidValue ? s.paidValue.toFixed(2) : '0.00';
    s.discount = s.discount ? s.discount.toFixed(2) : '0.00';
    s.valueToReceive = s.valueToReceive ? s.valueToReceive.toFixed(2) : '0.00';
    history.push({ pathname: '/sales/edit', state: s });
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
                <td>{c.name}</td>
                <td>
                  {c.street}, {c.complement}
                </td>
                <td>{c.neighborhood}</td>
                <td>{c.city}</td>
                <td>{c.phone}</td>
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
        <InputText
          value={client.name}
          placeholder="Digite o nome do cliente"
          onChange={e => setClient({ ...client, name: e.target.value })}
        />
        <p>Rua</p>
        <AutoComplete
          dropdown
          value={client.street}
          onChange={e => setClient({ ...client, street: e.target.value })}
          suggestions={streetSuggestions}
          completeMethod={suggestsStreets}
          placeholder="Digite o nome da rua"
        />
        <p>Complemento</p>
        <InputText
          value={client.complement}
          onChange={e => setClient({ ...client, complement: e.target.value })}
          placeholder="Digite o complemento do endereço"
        />
        <p>Bairro</p>
        <AutoComplete
          dropdown
          value={client.neighborhood}
          onChange={e => setClient({ ...client, neighborhood: e.target.value })}
          suggestions={neighborhoodSuggestions}
          completeMethod={suggestsNeighborhoods}
          placeholder="Digite o nome do bairro"
        />
        <div className="input-city-container">
          <div>
            <p>Cidade</p>
            <AutoComplete
              dropdown
              value={client.city}
              onChange={e => setClient({ ...client, city: e.target.value })}
              suggestions={citySuggestions}
              completeMethod={suggestsCities}
              placeholder="Digite o nome da cidade"
            />
          </div>
          <div>
            <p>Telefone</p>
            <InputText
              value={client.phone}
              onChange={e => setClient({ ...client, phone: e.target.value })}
              placeholder="Digite o telefone do cliente"
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
        msg={`Deseja realmente excluir o cliente ${client.name}?`}
        handleConfirm={() => handleDelete(client.id)}
        handleClose={() => toogleDeleteModal(null)}
      />

      {/* Purchases made modal */}
      <PurchasesMadeModal
        isOpen={modalOpen.purchasesMadeModal}
        onRequestClose={() => tooglePurchasesModal(null)}
        overlayClassName="modal-overlay"
      >
        <header className="p-grid p-nogutter p-justify-between">
          <h2>{`Compras feitas por ${client.name}`}</h2>
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
                    <td className="sale-id">{sale.saleId}</td>
                    <td>{sale.saleDate}</td>
                    <td>{`R$${sale.netValue.toFixed(2)}`}</td>
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
                        <FiEdit
                          size={24}
                          title="Editar venda"
                          onClick={() => editSale(sale)}
                        />
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
