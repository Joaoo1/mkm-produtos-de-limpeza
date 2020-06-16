import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { AutoComplete } from 'primereact/autocomplete';
import { FiPlus, FiFilter } from 'react-icons/fi';

import {
  FilterButton,
  AddButton,
  ListHeaderContainer,
  FilterContainer,
} from './styles';

const propTypes = {
  btnText: PropTypes.string.isRequired,
  btnFunction: PropTypes.func.isRequired,
  filterList: PropTypes.func.isRequired,
  filterEnabled: PropTypes.bool,
  placeHolder: PropTypes.string,
};

const defaultProps = {
  filterEnabled: false,
  placeHolder: '',
};

export default function ListHeader({
  btnText,
  btnFunction,
  filterList,
  filterEnabled,
  placeHolder,
}) {
  const addressesOptions = [
    { label: 'Rua', value: 'street' },
    { label: 'Bairro', value: 'neighborhood' },
    { label: 'Cidade', value: 'city' },
  ];
  const [showFilter, setShowFilter] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [situations, setSituations] = useState({
    paid: false,
    unpaid: false,
    partially: false,
  });
  const [addressType, setAddressType] = useState('');
  return (
    <>
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
        <FilterContainer>
          <div className="period">
            <p>Informe o período</p>
            <div>
              <Calendar
                value={dateRange.startDate}
                onChange={e =>
                  setDateRange({ startDate: e.target.value, ...dateRange })
                }
                placeholder="Data inicial"
              />

              <Calendar
                value={dateRange.startDate}
                onChange={e =>
                  setDateRange({ startDate: e.target.value, ...dateRange })
                }
                placeholder="Data Final"
              />
            </div>
            <small>Deixar em branco pegará todas as datas</small>
          </div>

          <div className="situation">
            <p>Situação do pagamento</p>
            <label>
              <Checkbox
                value={situations.paid}
                onChange={() =>
                  setSituations({ paid: !situations.paid, ...situations })
                }
              />
              Pago
            </label>
            <label>
              <Checkbox
                value={situations.unpaid}
                onChange={() =>
                  setSituations({ unpaid: !situations.unpaid, ...situations })
                }
              />
              Não Pago
            </label>
            <label>
              <Checkbox
                value={situations.partially}
                onChange={() =>
                  setSituations({
                    partially: !situations.partially,
                    ...situations,
                  })
                }
              />
              Parcialmente Pago
            </label>
          </div>
          <div className="address">
            <p>Endereço</p>
            <div>
              <Dropdown
                value={addressType}
                options={addressesOptions}
                onChange={e => setAddressType(e.value)}
                placeholder="Selecione o tipo"
              />
              <AutoComplete placeholder="Digite o endereço" />
            </div>
          </div>
          <div className="buttons">
            <button type="button">Limpar filtro</button>
            <button type="button">Aplicar filtro</button>
          </div>
        </FilterContainer>
      ) : null}
    </>
  );
}

ListHeader.propTypes = propTypes;
ListHeader.defaultProps = defaultProps;
