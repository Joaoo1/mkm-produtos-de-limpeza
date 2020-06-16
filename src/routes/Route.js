import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../helpers/AuthProvider';
import DefaultLayout from '../pages/_layouts/default';

const propTypes = {
  component: PropTypes.oneOfType([PropTypes.element, PropTypes.func])
    .isRequired,
  isPrivate: PropTypes.bool,
  title: PropTypes.string.isRequired,
};

const defaultProps = {
  isPrivate: false,
};

export default function RouteWrapper({
  component: Component,
  isPrivate,
  title,
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
        <DefaultLayout title={title}>
          <Component {...props} />
        </DefaultLayout>
      )}
    />
  );
}

RouteWrapper.propTypes = propTypes;
RouteWrapper.defaultProps = defaultProps;
