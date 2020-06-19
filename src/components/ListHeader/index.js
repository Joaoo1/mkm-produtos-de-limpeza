import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete } from 'primereact/autocomplete';
import { Growl } from 'primereact/growl';
import { FiPlus, FiFilter } from 'react-icons/fi';

import {
  SALE_CLIENT_STREET,
  SALE_CLIENT_NEIGHBORHOOD,
  SALE_CLIENT_CITY,
  SALE_DATE,
  SALE_PAID,
} from '../../constants/firestore';

import StreetController from '../../controllers/StreetController';
import Neighborhoodcontroller from '../../controllers/NeighborhoodController';
import CityController from '../../controllers/CityController';
import SaleController from '../../controllers/SaleController';

import {
  FilterButton,
  AddButton,
  ListHeaderContainer,
  FilterContainer,
} from './styles';
import { errorMsg } from '../../helpers/Growl';

const propTypes = {
  btnText: PropTypes.string.isRequired,
  btnFunction: PropTypes.func.isRequired,
  filterList: PropTypes.func.isRequired,
  filterEnabled: PropTypes.bool,
  filterButtonFunction: PropTypes.func,
  placeHolder: PropTypes.string,
};

const defaultProps = {
  filterEnabled: false,
  placeHolder: '',
  filterButtonFunction: null,
};

const ptbr = {
  firstDayOfWeek: 1,
  dayNames: [
    'domingo',
    'segunda',
    'terça',
    'quarta',
    'quinta',
    'sexta',
    'sábado',
  ],
  dayNamesShort: ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'],
  dayNamesMin: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
  monthNames: [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ],
  monthNamesShort: [
    'jan',
    'fev',
    'mar',
    'abr',
    'mai',
    'jun',
    'jul',
    'ago',
    'set',
    'out',
    'nov',
    'dez',
  ],
  today: 'Hoje',
  clear: 'Limpar',
  dateFormat: 'dd/mm/yy',
  weekHeader: 'Sm',
};

export default function ListHeader({
  btnText,
  btnFunction,
  filterList,
  filterEnabled,
  filterButtonFunction,
  placeHolder,
}) {
  const growl = useRef(null);
  const [showFilter, setShowFilter] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [situations, setSituations] = useState({
    paid: false,
    unpaid: false,
  });
  const addressesOptions = [
    { label: 'Rua', value: SALE_CLIENT_STREET },
    { label: 'Bairro', value: SALE_CLIENT_NEIGHBORHOOD },
    { label: 'Cidade', value: SALE_CLIENT_CITY },
  ];
  const [allAddresses, setAllAddresses] = useState([]);
  const [addressType, setAddressType] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState(['']);
  const [address, setAddress] = useState('');

  useEffect(() => {
    async function fetchAddress() {
      if (addressType === SALE_CLIENT_STREET) {
        const streets = await StreetController.index();
        setAllAddresses(streets);
      }
      if (addressType === SALE_CLIENT_NEIGHBORHOOD) {
        const neighborhood = await Neighborhoodcontroller.index();
        setAllAddresses(neighborhood);
      }
      if (addressType === SALE_CLIENT_CITY) {
        const cities = await CityController.index();
        setAllAddresses(cities);
      }
    }
    fetchAddress();
  }, [addressType]);

  function suggestsAddresses(event) {
    const suggestionResults = allAddresses.filter(addressSuggestion =>
      addressSuggestion.name.toLowerCase().startsWith(event.query.toLowerCase())
    );

    const results = suggestionResults.map(address => address.name);
    setAddressSuggestions(results);
  }

  async function filter() {
    const filters = [];

    function checkAddressFilter() {
      // Nothing was digit, so don't apply filter
      if (address.length === 0) {
        return true;
      }

      if (addressType.length === 0) {
        errorMsg(growl, 'Selecione o tipo de endereço');
        return false;
      }
      // Checking if address exists
      for (let i = 0; i < allAddresses.length; i++) {
        if (allAddresses[i].name === address) {
          filters.push({ field: addressType, operator: '==', value: address });
          return true;
        }
      }
      errorMsg(growl, 'Endereço não encontrado!');
      return false;
    }

    function checkDateRange() {
      if (!dateRange.startDate && !dateRange.endDate) {
        return true;
      }

      if (dateRange.startDate) {
        filters.push({
          field: SALE_DATE,
          operator: '>=',
          value: dateRange.startDate,
        });
      }

      if (dateRange.endDate) {
        /*
         * Because of the way the database works, it is necessary to increment
         * 1 day on the end date and use the operator less than instead of equal
         * to or less than the end date
         */
        const date = new Date(dateRange.endDate);
        date.setDate(date.getDate() + 1);
        filters.push({
          field: SALE_DATE,
          operator: '<',
          value: date,
        });
      }

      return true;
    }

    function checkSituation() {
      if (situations.paid && !situations.unpaid) {
        filters.push({ field: SALE_PAID, operator: '==', value: true });
      } else if (situations.unpaid && !situations.paid) {
        filters.push({ field: SALE_PAID, operator: '==', value: false });
      }

      return true;
    }

    if (!checkAddressFilter()) return;
    if (!checkDateRange()) return;
    if (!checkSituation()) return;

    const sales = await SaleController.index(null, filters);
    filterButtonFunction(sales);
  }

  async function cleanFilter() {
    setDateRange({ startDate: '', endDate: '' });
    setSituations({ paid: false, unpaud: false });
    setAddressType('');
    setAddress('');
    const allSales = await SaleController.index(100);
    filterButtonFunction(allSales);
  }

  return (
    <>
      <Growl ref={growl} />
      <ListHeaderContainer>
        <InputText placeholder={placeHolder} onChange={e => filterList(e)} />

        {filterEnabled ? (
          <FilterButton onClick={() => setShowFilter(!showFilter)}>
            <FiFilter size={24} />
            Filtrar lista
          </FilterButton>
        ) : null}

        <AddButton type="button" onClick={() => btnFunction()}>
          <FiPlus size={24} />
          {btnText}
        </AddButton>
      </ListHeaderContainer>

      {showFilter ? (
        <FilterContainer className="p-grid p-nogutter p-dir-col">
          <div className="p-formgroup-inline p-justify-around p-nogutter">
            <div className="p-grid p-dir-col period">
              <p>Informe o período</p>
              <Calendar
                locale={ptbr}
                dateFormat="dd/mm/yy"
                value={dateRange.startDate}
                onChange={e =>
                  setDateRange({ ...dateRange, startDate: e.target.value })
                }
                placeholder="Data inicial"
              />

              <Calendar
                locale={ptbr}
                dateFormat="dd/mm/yy"
                value={dateRange.endDate}
                onChange={e =>
                  setDateRange({ ...dateRange, endDate: e.target.value })
                }
                placeholder="Data Final"
              />
              <small>Deixar em branco pegará todas as datas</small>
            </div>
            <div className="situation">
              <p>Situação do pagamento</p>
              <label>
                <Checkbox
                  checked={situations.paid}
                  onChange={() =>
                    setSituations({ ...situations, paid: !situations.paid })
                  }
                />
                Pago
              </label>
              <label>
                <Checkbox
                  checked={situations.unpaid}
                  onChange={() =>
                    setSituations({
                      ...situations,
                      unpaid: !situations.unpaid,
                    })
                  }
                />
                Não Pago
              </label>
            </div>
            <div className="address">
              <p>Endereço</p>
              <div className="p-grid p-dir-col p-nogutter">
                <Dropdown
                  value={addressType}
                  options={addressesOptions}
                  onChange={e => setAddressType(e.value)}
                  placeholder="Selecione o tipo"
                />
                <AutoComplete
                  value={address}
                  dropdown
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Digite o endereço"
                  completeMethod={suggestsAddresses}
                  suggestions={addressSuggestions}
                />
              </div>
            </div>
          </div>
          <div className="buttons">
            <button type="button" onClick={cleanFilter}>
              Limpar filtro
            </button>
            <button type="button" onClick={filter}>
              Aplicar filtro
            </button>
          </div>
        </FilterContainer>
      ) : null}
    </>
  );
}

ListHeader.propTypes = propTypes;
ListHeader.defaultProps = defaultProps;
