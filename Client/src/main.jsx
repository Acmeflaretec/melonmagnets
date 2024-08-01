import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import ContextShare from './context/ContextShare.jsx';
import './index.css';
import store from './redux/store';
import { Provider } from 'react-redux';



ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextShare>
      <Provider store={store}>
      <HashRouter>
      <App />
      </HashRouter>
      </Provider>
    </ContextShare>
  </React.StrictMode>,
)
