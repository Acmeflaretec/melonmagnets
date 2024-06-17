import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { HashRouter } from 'react-router-dom';
import ContextShare from './context/ContextShare.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextShare>
      <HashRouter>
      <App />
      </HashRouter>
    </ContextShare>
  </React.StrictMode>,
)
