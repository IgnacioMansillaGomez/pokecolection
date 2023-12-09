import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.tsx';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebase/firebaseConfig.ts';
import './main.scss';

initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
