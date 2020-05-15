import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthProvider';
import DefaultLayout from '../pages/_layouts/default';

const propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  isPrivate: PropTypes.bool,
};

const defaultProps = {
  isPrivate: false,
};

export default function RouteWrapper({
  component: Component,
  isPrivate,
  ...rest
}) {
  const { user } = useContext(AuthContext);

  if (isPrivate && !user) {
    return <Redirect to="/" />;
  }

  if (!isPrivate && user) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <Route
      {...rest}
      render={props => (
        <DefaultLayout>
          <Component {...props} />
        </DefaultLayout>
      )}
    />
  );
}

RouteWrapper.propTypes = propTypes;
RouteWrapper.defaultProps = defaultProps;
