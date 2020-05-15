import React from 'react';
import PropTypes from 'prop-types';
import Menu from './DefaultAside';
import Header from './DefaultHeader';

import { Container, Main } from './styles';

export default function DefaultLayout({ children }) {
  return (
    <>
      <Container>
        <Header />
        <Menu />
        <Main>{children}</Main>
      </Container>
    </>
  );
}

DefaultLayout.propTypes = {
  children: PropTypes.element.isRequired,
};
