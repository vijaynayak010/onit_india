import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import {
  AUTH_APP_CHANGED_EVENT,
  resolveAuth0AppFromPath,
  resolveAuth0ClientIdForLocation,
  getAuth0RedirectUri,
} from "../../config/auth0";

const AppAuth0Provider = ({ children }) => {
  const location = useLocation();
  const [authAppRevision, setAuthAppRevision] = useState(0);

  useEffect(() => {
    const refresh = () => setAuthAppRevision((value) => value + 1);
    window.addEventListener(AUTH_APP_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(AUTH_APP_CHANGED_EVENT, refresh);
  }, []);

  void authAppRevision;

  const app = resolveAuth0AppFromPath(location.pathname);
  const clientId = resolveAuth0ClientIdForLocation(
    location.pathname,
    location.state
  );
  const redirectUri = getAuth0RedirectUri();
  const domain = String(import.meta.env.VITE_AUTH0_DOMAIN || "").trim();

  if (!clientId || !domain) {
    console.error(
      "[AUTH0] Missing clientId or domain. Check VITE_AUTH0_DOMAIN and VITE_AUTH0_CLIENT_ID_* in client/.env",
      { clientId: !!clientId, domain: !!domain, app }
    );
    return children;
  }

  return (
    <Auth0Provider
      key={clientId}
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: `${import.meta.env.VITE_AUTH0_SCOPE || "openid profile email"} offline_access`,
      }}
      cacheLocation="localstorage"
      useRefreshTokens
      useRefreshTokensFallback
      onRedirectCallback={(appState) => {
        console.log("[AUTH0] Login callback success", appState);
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default AppAuth0Provider;
