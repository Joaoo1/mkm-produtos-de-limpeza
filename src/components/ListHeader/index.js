import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Calendar } from 'primereact/calendar';
import { Growl } from 'primereact/growl';
import { Checkbox } from 'primereact/checkbox';
import { FiPlus, FiFilter } from 'react-icons/fi';

import {
  FilterButton,
  AddButton,
  ListHeaderContainer,
  FilterContainer,
  Period,
} from './styles';

const propTypes = {
  btnText: PropTypes.string.isRequired,
  btnFunction: PropTypes.func.isRequired,
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
  filterEnabled,
  placeHolder,
}) {
  const [showFilter, setShowFilter] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [situations, setSituations] = useState({
    paid: false,
    unpaid: false,
    partially: false,
  });

  return (
    <>
      <ListHeaderContainer>
        <input placeholder={placeHolder} />

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
                  setDateRange({ startDate: e.target.value, ...dateRange })}
                placeholder="Data inicial"
              />

              <Calendar
                value={dateRange.startDate}
                onChange={e =>
                  setDateRange({ startDate: e.target.value, ...dateRange })}
                placeholder="Data Final"
              />
            </div>
            <small>Deixar em branco pegará todas as datas</small>
          </div>

          <div className="situation">
            <p>Situação do pagamento</p>
            <Checkbox
              value={situations.paid}
              onChange={() =>
                setSituations({ paid: !situations.paid, ...situations })}
            />
            Pago
            <Checkbox
              value={situations.unpaid}
              onChange={() =>
                setSituations({ unpaid: !situations.unpaid, ...situations })}
            />
            Não Pago
            <Checkbox
              value={situations.partially}
              onChange={() =>
                setSituations({
                  partially: !situations.partially,
                  ...situations,
                })}
            />
            Parcialmente Pago
          </div>
          <small>Não marcar nenhuma opção pegará todas as situações</small>

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
