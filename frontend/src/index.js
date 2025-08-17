// frontend/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Importe aqui

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Adicione o Provider aqui */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);