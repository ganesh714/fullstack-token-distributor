import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Create health endpoint
if (import.meta.env.PROD) {
  import('./health.js').then(module => {
    const app = module.default;
    // Health endpoint is already set up in server.js for production
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)