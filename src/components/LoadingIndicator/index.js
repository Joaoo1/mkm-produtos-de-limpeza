import React from 'react';
import ReactLoading from 'react-loading';
import PropTypes from 'prop-types';

import { LoadingContainerLocal, LoadingContainerAbsolute } from './styles';

const defaultProps = {
  absolute: true,
};

const propTypes = {
  absolute: PropTypes.bool,
};

const LoadingIndicator = ({ absolute }) => {
  return absolute ? (
    <LoadingContainerAbsolute>
      <ReactLoading
        type="spin"
        color="#1859ad"
        height={125}
        width={75}
        className="loading"
      />
    </LoadingContainerAbsolute>
  ) : (
    <LoadingContainerLocal>
      <ReactLoading
        type="spin"
        color="#1859ad"
        height={100}
        width={60}
        className="loading"
      />
    </LoadingContainerLocal>
  );
};

LoadingIndicator.defaultProps = defaultProps;
LoadingIndicator.propTypes = propTypes;

export default LoadingIndicator;
