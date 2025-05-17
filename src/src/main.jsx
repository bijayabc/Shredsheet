import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// NOTE: In local development, you might see a "Service Worker has unsupported MIME type 'text/html'" error.
// This is harmless — it happens because Vite's dev server doesn't serve sw.js from the root.
// In production, sw.js will be served correctly from the /dist root with the proper MIME type.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
