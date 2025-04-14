import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-ieatf506s3q1ikgq.us.auth0.com"
      clientId="ajEd9l3vDrYZN2QQYNyBXXMwDGmUXMBs"
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: "this is my identifier(unique)",
        scope: "openid profile email read:protected",
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
