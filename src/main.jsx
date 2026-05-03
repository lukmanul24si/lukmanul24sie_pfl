import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// IMPORT INI HARUS ADA! Sesuaikan path-nya dengan struktur foldermu
import './assets/tailwind.css'
import './index.css' 
import { AppProvider } from './context/AppContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)