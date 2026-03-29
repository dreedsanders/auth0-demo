import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
import { useState } from 'react';

function App() {
  const {
    loginWithPopup,
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0();

  const [apiResult, setApiResult] = useState(null);

  async function callApi() {
    setApiResult(null);
    try {
      const response = await axios.get('http://localhost:4000');
      setApiResult({ ok: true, body: response.data });
    } catch (error) {
      setApiResult({ ok: false, body: error.message });
    }
  }

  async function callProtectedApi() {
    setApiResult(null);
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get('http://localhost:4000/protected', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApiResult({ ok: true, body: response.data });
    } catch (error) {
      setApiResult({
        ok: false,
        body: error.response?.data ?? error.message,
      });
    }
  }

  return (
    <div className="app">
      <div className="app__bg" aria-hidden="true" />

      <header className="app__header">
        <div className="app__brand">
          <span className="app__logo" aria-hidden="true" />
          <div>
            <h1 className="app__title">Auth0 demo</h1>
            <p className="app__subtitle">
              Sign in, then exercise the public and protected API routes.
            </p>
          </div>
        </div>
        <div
          className={`app__status app__status--${isAuthenticated ? 'in' : 'out'}`}
          role="status"
        >
          <span className="app__status-dot" aria-hidden="true" />
          {isAuthenticated ? 'Signed in' : 'Signed out'}
        </div>
      </header>

      <main className="app__main">
        <section className="panel" aria-labelledby="session-heading">
          <h2 id="session-heading" className="panel__title">
            Session
          </h2>
          <p className="panel__hint">
            Choose how Auth0 opens the login experience.
          </p>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => loginWithPopup()}
            >
              Log in (popup)
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => loginWithRedirect()}
            >
              Log in (redirect)
            </button>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              Log out
            </button>
          </div>
        </section>

        <section className="panel" aria-labelledby="api-heading">
          <h2 id="api-heading" className="panel__title">
            API
          </h2>
          <p className="panel__hint">
            <code className="inline-code">GET /</code> is open;{' '}
            <code className="inline-code">GET /protected</code> needs a valid access token.
          </p>
          <div className="btn-row">
            <button type="button" className="btn btn--accent" onClick={callApi}>
              Call public API
            </button>
            <button
              type="button"
              className="btn btn--accent"
              onClick={callProtectedApi}
            >
              Call protected API
            </button>
          </div>
          {apiResult !== null && (
            <div
              className={`api-out api-out--${apiResult.ok ? 'ok' : 'err'}`}
              role="region"
              aria-label="Last API response"
            >
              <span className="api-out__label">
                {apiResult.ok ? 'Response' : 'Error'}
              </span>
              <pre className="api-out__pre">
                {typeof apiResult.body === 'string'
                  ? apiResult.body
                  : JSON.stringify(apiResult.body, null, 2)}
              </pre>
            </div>
          )}
        </section>

        {isAuthenticated && user && (
          <section className="panel panel--user" aria-labelledby="profile-heading">
            <h2 id="profile-heading" className="panel__title">
              Profile
            </h2>
            <div className="user-card">
              {user.picture ? (
                <img
                  className="user-card__avatar"
                  src={user.picture}
                  alt=""
                  width={56}
                  height={56}
                />
              ) : (
                <div className="user-card__avatar user-card__avatar--placeholder" aria-hidden>
                  {(user.name || user.email || '?').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="user-card__meta">
                <p className="user-card__name">{user.name || 'Signed-in user'}</p>
                {user.email && (
                  <p className="user-card__email">{user.email}</p>
                )}
              </div>
            </div>
            <details className="user-json">
              <summary className="user-json__summary">Raw user object</summary>
              <pre className="user-json__pre">{JSON.stringify(user, null, 2)}</pre>
            </details>
          </section>
        )}
      </main>

      <footer className="app__footer">
        <span>Local API at </span>
        <code className="inline-code">localhost:4000</code>
      </footer>
    </div>
  );
}

export default App;
