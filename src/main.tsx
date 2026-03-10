import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initSessionId } from './utils/session.ts';
import './index.css'
import App from './App.tsx'

// Initialize session ID on app startup
initSessionId();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
