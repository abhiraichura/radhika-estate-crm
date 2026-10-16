import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Bridge Vercel VITE_ Environment Variables into the CRM automatically
if (import.meta.env.VITE_FIREBASE_API_KEY) {
  window.__firebase_config = JSON.stringify({
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
  });
}
if (import.meta.env.VITE_GEMINI_API_KEY) {
  window.__gemini_api_key = import.meta.env.VITE_GEMINI_API_KEY;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
