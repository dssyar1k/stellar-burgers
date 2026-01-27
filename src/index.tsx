import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './components/app/app';
import store from './services/store';

const initializeApp = () => {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Root element not found in HTML');
  }

  const root = ReactDOMClient.createRoot(container);

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
};

initializeApp();
