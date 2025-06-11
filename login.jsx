import React from 'react';
import { loginWithHubSpot } from '../api';

const LoginPage = () => {
  return (
    <div>
      <h2>Login with HubSpot</h2>
      <button onClick={loginWithHubSpot}>
        Connect HubSpot
      </button>
    </div>
  );
};

export default LoginPage;
