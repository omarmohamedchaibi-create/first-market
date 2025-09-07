import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./i18n";
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <I18nextProvider i18n={i18next}>
          <App />
        </I18nextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
