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
  const growl = useRef(null);

  // const [addressList, setAddressList] = useState([]);

  function handleAddStreet() {
    const { value } = document.getElementById('input-street');
    StreetController.index().then(data => {
      const allRegisters = data.docs.map(snapshot => {
        return snapshot.data().nome_rua.toLowerCase();
      });
      if (allRegisters.includes(value.toLowerCase())) {
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
    });
  }

  function handleAddNeighborhood() {
    const { value } = document.getElementById('input-neighborhood');
    NeighborhoodController.index().then(data => {
      const allRegisters = data.docs.map(snapshot => {
        return snapshot.data().nome_bairro.toLowerCase();
      });

      if (allRegisters.includes(value.toLowerCase())) {
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
    });
  }

  function handleAddCity() {
    const { value } = document.getElementById('input-city');
    CityController.index().then(data => {
      const allRegisters = data.docs.map(snapshot => {
        return snapshot.data().nome_cidade.toLowerCase();
      });
      if (allRegisters.includes(value.toLowerCase())) {
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
            <AddButton onClick={handleAddStreet}>
              <FiPlus size={30} color="white" title="Cadastrar rua" value="" />
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
            <AddButton onClick={handleAddNeighborhood}>
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
            <AddButton onClick={handleAddCity}>
              <FiPlus size={30} color="white" title="Cadastrar cidade" />
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
