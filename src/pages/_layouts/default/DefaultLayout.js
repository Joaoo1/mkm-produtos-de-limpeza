import React from 'react';
import PropTypes from 'prop-types';
import Menu from './DefaultAside';
import Header from './DefaultHeader';

import { Container, Main } from './styles';

const propTypes = {
  children: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
};

export default function DefaultLayout({ title, children }) {
  return (
    <>
      <Container>
        <Header title={title} />
        <Menu />
        <Main>{children}</Main>
      </Container>
    </>
  );
}

DefaultLayout.propTypes = propTypes;
