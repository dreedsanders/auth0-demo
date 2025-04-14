import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
// get access token silently gets jwt token from auth0

function App() {
  const { loginWithPopup, loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  
  function callApi() {
    axios.get('http://localhost:4000')
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }

  async function callProtectedApi() {
    const token = await getAccessTokenSilently();
    try {
      const response = await axios.get("http://localhost:4000/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error("There was an error!", error.message);
    }
  }
  return (
    <div className="App">
      <ul>
        <li>
          <button onClick={loginWithPopup}>Login with popup</button>
        </li>
        <li>
          <button onClick={loginWithRedirect}>Login with redirect</button>
        </li>
        <li>
          <button onClick={logout}>Logout</button>
        </li>
      </ul>
      <ul>
        <li>
          <button onClick={callApi}>call api</button>
        </li>
        <li>
          <button onClick={callProtectedApi}>call protected api</button>
        </li>
      </ul>
      <h3>User is {isAuthenticated ? "logged in" : "not logged in"}</h3>
      {isAuthenticated ? (
        <pre style={{ textAlign: "start" }}>
          {JSON.stringify(user, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}

export default App;
