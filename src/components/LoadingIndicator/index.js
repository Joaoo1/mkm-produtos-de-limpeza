import React from 'react';
import ReactLoading from 'react-loading';

import { LoadingContainer } from './styles';

export default function LoadingIndicator() {
  return (
    <LoadingContainer>
      <ReactLoading
        type="spin"
        color="#1859ad"
        height={125}
        width={75}
        className="loading"
      />
    </LoadingContainer>
  );
}
