import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Auth } from '../server/firebase';

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    Auth.onAuthStateChanged(user => {
      setUser(user);
      setPending(false);
    });
  }, []);

  if (pending) {
    return <>Carregando...</>;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
