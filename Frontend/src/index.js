// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/css/estilo.css';
import './assets/css/admin.css';
// Importamos el CartProvider
import { CartProvider } from './context/CartContext'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Envolvemos App con el CartProvider */}
    <CartProvider>
      <App />
    </CartProvider>
  </React.StrictMode>
);

