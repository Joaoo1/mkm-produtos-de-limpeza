import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FiPlus, FiFilter } from 'react-icons/fi';

import ListHeaderContainer, { FilterButton, AddButton } from './styles';

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

  return (
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
  );
}

ListHeader.propTypes = propTypes;
ListHeader.defaultProps = defaultProps;
