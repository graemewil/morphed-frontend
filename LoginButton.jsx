// frontend/components/LoginButton.jsx
import React from 'react';

const LoginButton = () => {
  const handleLogin = () => {
    // This URL points to your backend's /api/auth/login route
    window.location.href = 'https://morphed-hs-production.up.railway.app/api/auth/login';
  };

  return (
    <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
      Connect to HubSpot
    </button>
  );
};

export default LoginButton;
