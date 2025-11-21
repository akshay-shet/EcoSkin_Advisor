// FIX: Moved side-effect imports for 'i18n' and 'types' after 'React' to ensure React's JSX types are loaded before augmentation.
import React from 'react';
import './i18n';
import './types';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);