import React, { useState, useRef } from 'react';
import { FiPlus, FiEdit, FiX, FiTrash2, FiClipboard } from 'react-icons/fi';
import { InputText } from 'primereact/inputtext';
import { Growl } from 'primereact/growl';
import { errorMsg, successMsg } from '../../helpers/Growl';

import {
  SelectClientModal as SelectAddressModal,
  ModalButtonsContainer,
  EditAddressModal,
} from '../../styles/modal';

import { PrimaryButton, SecondaryButton } from '../../styles/button';
import { AddressContainer, ManageAddress } from './styles';

import StreetController from '../../controllers/StreetController';
import NeighborhoodController from '../../controllers/NeighborhoodController';
import CityController from '../../controllers/CityController';

export default function Settings() {
  const STREET = 'rua';
  const NEIGHBORHOOD = 'bairro';
  const CITY = 'cidade';

  const growl = useRef(null);
  SelectAddressModal.setAppElement('#root');
  EditAddressModal.setAppElement('#root');

  const [editAddressModal, setEditAddressModal] = useState({
    isOpen: false,
    name: '',
    id: '',
  });

  const [selectAddressModal, setSelectAddressModal] = useState({
    isOpen: false,
    type: '',
  });
  const [addressList, setAddressList] = useState([]);
  const [filteredAddressList, setFilteredAddressList] = useState([]);

  async function fetchAddresses(type) {
    if (type === STREET) {
      const allStreets = await StreetController.index();
      setAddressList(allStreets);
      setFilteredAddressList(allStreets);
    } else if (type === NEIGHBORHOOD) {
      const allNeighborhoods = await NeighborhoodController.index();
      setAddressList(allNeighborhoods);
      setFilteredAddressList(allNeighborhoods);
    } else if (type === CITY) {
      const allCities = await CityController.index();
      setAddressList(allCities);
      setFilteredAddressList(allCities);
    }
  }

  function filterAddressList(event) {
    setFilteredAddressList(
      addressList.filter(address =>
        address.name.toLowerCase().includes(event.target.value)
      )
    );
  }

  async function toggleSelectAddressModal(type) {
    if (selectAddressModal.isOpen) {
      setSelectAddressModal({ ...selectAddressModal, isOpen: false });
      setAddressList([]);
      return;
    }
    fetchAddresses(type);
    setSelectAddressModal({ ...selectAddressModal, type, isOpen: true });
  }

  function toggleEditAddressModal(address) {
    if (editAddressModal.isOpen) {
      setEditAddressModal({ ...editAddressModal, isOpen: false });
      return;
    }

    setEditAddressModal({ name: address.name, id: address.id, isOpen: true });
  }

  async function handleAddStreet() {
    const { value } = document.getElementById('input-street');
    const allStreets = await StreetController.index();
    if (allStreets.includes(value.toLowerCase())) {
      errorMsg(growl, `Essa rua já está cadastrada`);
      return;
    }

    StreetController.create({ nome_rua: value }).then(
      () => {
        successMsg(growl, 'Rua cadastrada com sucesso');
        document.getElementById('input-street').value = '';
      },
      () => errorMsg(growl, 'Ocorreu um erro ao cadastrar rua')
    );
  }

  async function handleAddNeighborhood() {
    const { value } = document.getElementById('input-neighborhood');

    const allNeighborhoods = await NeighborhoodController.index();
    if (allNeighborhoods.includes(value.toLowerCase())) {
      errorMsg(growl, `Esse bairro já está cadastrado`);
      return;
    }

    NeighborhoodController.create({ nome_bairro: value }).then(
      () => {
        successMsg(growl, 'Bairro cadastrado com sucesso');
        document.getElementById('input-neighborhood').value = '';
      },
      () => errorMsg(growl, 'Ocorreu um erro ao cadastrar bairro')
    );
  }

  async function handleAddCity() {
    const { value } = document.getElementById('input-city');
    const allCities = await CityController.index();
    if (allCities.includes(value.toLowerCase())) {
      errorMsg(growl, `Essa cidade já está cadastrada`);
      return;
    }

    CityController.create({ nome_cidade: value }).then(
      () => {
        successMsg(growl, 'Cidade cadastrada com sucesso');
        document.getElementById('input-city').value = '';
      },
      () => errorMsg(growl, 'Ocorreu um erro ao cadastrar rua')
    );
  }

  function handleEditAddress() {
    const controller = () => {
      if (selectAddressModal.type === STREET) {
        return StreetController;
      }
      if (selectAddressModal.type === NEIGHBORHOOD) {
        return NeighborhoodController;
      }
      if (selectAddressModal.type === CITY) {
        return CityController;
      }

      return null;
    };

    if (!controller()) return;

    controller()
      .update(editAddressModal.name, editAddressModal.id)
      .then(() => {
        successMsg(growl, 'Editado com sucesso');
        fetchAddresses(selectAddressModal.type);
        setEditAddressModal({ ...editAddressModal, isOpen: false });
      });
  }

  function handleDeleteAddress(id) {
    switch (selectAddressModal.type) {
      case STREET:
        StreetController.delete(id).then(() => {
          successMsg(growl, 'Excluido com sucesso');
          fetchAddresses(selectAddressModal.type);
        });
        break;
      case NEIGHBORHOOD:
        NeighborhoodController.delete(id).then(() => {
          successMsg(growl, 'Excluido com sucesso');
          fetchAddresses(selectAddressModal.type);
        });
        break;
      case CITY:
        CityController.delete(id).then(() => {
          successMsg(growl, 'Excluido com sucesso');
          fetchAddresses(selectAddressModal.type);
        });
        break;
      default:
        errorMsg(growl, 'Ocorreu um erro ao excluir endereço');
    }
  }

  return (
    <>
      <Growl ref={growl} />
      <AddressContainer>
        <SelectAddressModal
          isOpen={selectAddressModal.isOpen}
          onRequestClose={toggleSelectAddressModal}
          closeTimeoutMS={450}
          overlayClassName="modal-overlay"
        >
          <header className="p-grid p-justify-between">
            <h2>{`Editar ${selectAddressModal.type}s`}</h2>
            <FiX size={28} onClick={toggleSelectAddressModal} />
          </header>
          <hr />
          <InputText
            placeholder="Digite aqui para buscar"
            onChange={filterAddressList}
          />
          <table>
            <thead>
              <tr>
                <th colSpan="2">Nome</th>
              </tr>
            </thead>
            <tbody>
              {filteredAddressList.length > 0 &&
                filteredAddressList.map(address => {
                  return (
                    <tr key={address.id}>
                      <td>{address.name}</td>
                      <td>
                        <FiTrash2
                          color="red"
                          size={24}
                          title={`Excluir ${selectAddressModal.type}`}
                          onClick={() => handleDeleteAddress(address.id)}
                        />
                        <FiEdit
                          size={24}
                          onClick={() => toggleEditAddressModal(address)}
                          title={`Editar ${selectAddressModal.type}`}
                        />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>

          <EditAddressModal
            isOpen={editAddressModal.isOpen}
            onRequestClose={toggleEditAddressModal}
            closeTimeoutMS={450}
            overlayClassName="modal-overlay"
          >
            <header className="p-grid p-justify-between">
              <h2>Editar</h2>
              <FiX size={28} />
            </header>
            <hr />
            <InputText
              id="input-edit-address"
              value={editAddressModal.name}
              onChange={e =>
                setEditAddressModal({
                  ...editAddressModal,
                  name: e.target.value,
                })
              }
            />
            <hr />
            <ModalButtonsContainer>
              <SecondaryButton onClick={toggleSelectAddressModal}>
                Fechar
              </SecondaryButton>
              <PrimaryButton
                onClick={() => handleEditAddress(selectAddressModal.type)}
              >
                Salvar
              </PrimaryButton>
            </ModalButtonsContainer>
          </EditAddressModal>
        </SelectAddressModal>

        <h2>Gerenciar endereços</h2>
        <hr className="full" />
        <ManageAddress>
          <h4>Ruas</h4>
          <div className="flex-nowrap">
            <InputText
              id="input-street"
              placeholder="Digite aqui para cadastrar uma rua"
            />
            <PrimaryButton onClick={handleAddStreet}>
              <FiPlus size={30} color="white" title="Cadastrar rua" value="" />
            </PrimaryButton>
            <SecondaryButton>
              <FiClipboard
                size={30}
                onClick={() => toggleSelectAddressModal(STREET)}
                color="white"
                title="Editar ruas"
              />
            </SecondaryButton>
          </div>
        </ManageAddress>

        <hr />
        <ManageAddress>
          <h4>Bairros</h4>
          <div className="flex-nowrap">
            <InputText
              id="input-neighborhood"
              placeholder="Digite aqui para cadastrar um bairro"
            />
            <PrimaryButton onClick={handleAddNeighborhood}>
              <FiPlus
                size={26}
                onClick={() => {}}
                color="white"
                title="Cadastrar bairro"
              />
            </PrimaryButton>
            <SecondaryButton>
              <FiClipboard
                size={26}
                onClick={() => toggleSelectAddressModal(NEIGHBORHOOD)}
                color="white"
                title="Editar bairro"
              />
            </SecondaryButton>
          </div>
        </ManageAddress>

        <hr />
        <ManageAddress>
          <h4>Cidades</h4>
          <div className="flex-nowrap">
            <InputText
              id="input-city"
              placeholder="Digite aqui para cadastrar uma cidade"
            />
            <PrimaryButton onClick={handleAddCity}>
              <FiPlus size={30} color="white" title="Cadastrar cidade" />
            </PrimaryButton>
            <SecondaryButton>
              <FiClipboard
                size={30}
                onClick={() => toggleSelectAddressModal(CITY)}
                color="white"
                title="Editar cidade"
              />
            </SecondaryButton>
          </div>
        </ManageAddress>

        <hr />
      </AddressContainer>
    </>
  );
}
