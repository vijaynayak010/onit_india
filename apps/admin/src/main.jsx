import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react'
import { getAuth0ScopeWithOfflineAccess } from './utils/auth0Scope'

const auth0DatabaseConnection =
  import.meta.env.VITE_AUTH0_DATABASE_CONNECTION || 'Username-Password-Authentication';

const onRedirectCallback = (appState) => {
  // After Auth0 redirects back, send the user to their intended page (or dashboard)
  const target = appState?.returnTo || '/dashboard';
  window.history.replaceState({}, document.title, target);
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || import.meta.env.VITE_AUTH0_CLIENT_ID_PROVIDER}
      authorizationParams={{
        connection: auth0DatabaseConnection,
        redirect_uri: window.location.origin + '/login',
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: getAuth0ScopeWithOfflineAccess(),
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      useRefreshTokensFallback={true}
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)
