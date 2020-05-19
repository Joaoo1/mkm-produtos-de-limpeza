import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import GlobalStyles from './styles/global';

import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
<<<<<<< HEAD
import 'primeicons/primeicons.css';
=======
import 'primeflex/primeflex.css';
>>>>>>> d8ce1ba18720e301cbe3396056e6e991b3fe93b0

import AuthProvider from './helpers/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <GlobalStyles />
        <Routes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
