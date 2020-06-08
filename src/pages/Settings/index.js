import React, { useState, useRef } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { InputText } from 'primereact/inputtext';
import { Growl } from 'primereact/growl';
import { errorMsg, successMsg } from '../../helpers/Growl';

import {
  PrimaryButton as AddButton,
  SecondaryButton as EditButton,
  WarningButton as DeleteButton,
} from '../../styles/button';
import { AddressContainer, ManageAddress } from './styles';

import StreetController from '../../controllers/StreetController';
import NeighborhoodController from '../../controllers/NeighborhoodController';
import CityController from '../../controllers/CityController';

export default function Settings() {
  const STREET = 'rua';
  const NEIGHBORHOOD = 'bairro';
  const CITY = 'cidade';

  const growl = useRef(null);

  const [addressList, setAddressList] = useState([]);

  function handleAddAddress(value, type) {
    let query;

    switch (type) {
      case STREET:
        query = StreetController.index();
        break;

      case NEIGHBORHOOD:
        query = NeighborhoodController.index();
        break;

      case CITY:
        query = CityController.index();
        break;

      default:
        errorMsg(growl, 'Ocorreu um erro');
        return;
    }

    query.then(data => {
      const allRegisters = data.docs.map(snapshot => {
        return { ...snapshot.data(), id: snapshot.id };
      });

      if (allRegisters.includes(value)) {
        errorMsg(
          growl,
          `Ess${type === NEIGHBORHOOD ? 'e' : 'a'} rua já está cadastrada`
        );
        return;
      }

      StreetController.create(value).then(
        () => successMsg(growl, 'Rua cadastrada com sucesso'),
        () => errorMsg(growl, 'Ocorreu um erro ao cadastrar rua')
      );
    });
  }
  return (
    <>
      <Growl ref={growl} />
      <AddressContainer>
        <h2>Gerenciar endereços</h2>
        <hr className="full" />
        <ManageAddress>
          <h4>Ruas</h4>
          <div className="flex-nowrap">
            <InputText
              id="input-street"
              placeholder="Digite aqui para cadastrar uma rua"
            />
            <AddButton>
              <FiPlus
                size={30}
                onClick={e => handleAddAddress(e.target.value, STREET)}
                color="white"
                title="Cadastrar rua"
              />
            </AddButton>
            <EditButton>
              <FiEdit
                size={30}
                onClick={() => {}}
                color="white"
                title="Editar ruas"
              />
            </EditButton>
            <DeleteButton>
              <FiTrash2
                size={30}
                onClick={() => {}}
                color="white"
                title="Excluir ruas"
              />
            </DeleteButton>
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
            <AddButton>
              <FiPlus
                size={26}
                onClick={() => {}}
                color="white"
                title="Cadastrar bairro"
              />
            </AddButton>
            <EditButton>
              <FiEdit
                size={26}
                onClick={() => {}}
                color="white"
                title="Editar bairro"
              />
            </EditButton>
            <DeleteButton>
              <FiTrash2
                size={26}
                onClick={() => {}}
                color="white"
                title="Excluir bairro"
              />
            </DeleteButton>
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
            <AddButton>
              <FiPlus
                size={30}
                onClick={() => {}}
                color="white"
                title="Cadastrar cidade"
              />
            </AddButton>
            <EditButton>
              <FiEdit
                size={30}
                onClick={() => {}}
                color="white"
                title="Editar cidade"
              />
            </EditButton>
            <DeleteButton>
              <FiTrash2
                size={30}
                onClick={() => {}}
                color="white"
                title="Excluir cidade"
              />
            </DeleteButton>
          </div>
        </ManageAddress>

        <hr />
      </AddressContainer>
    </>
  );
}
