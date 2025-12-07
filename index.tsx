
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// In a real production environment, this should be in a .env file (e.g. process.env.GOOGLE_CLIENT_ID)
// Using the provided Client ID for this session.
const GOOGLE_CLIENT_ID = "257465215720-gc54qsupropia6opgvtmsnbdkmjer8h8.apps.googleusercontent.com";

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
