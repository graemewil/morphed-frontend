import React from 'react';

export default function Home() {
  const handleLogin = () => {
    window.location.href = 'https://morphed-hs-production-b0e9.up.railway.app/api/auth/login';
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '10rem' }}>
      <h1>Welcome to Morphed</h1>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        🔐 Login with HubSpot
      </button>
    </div>
  );
}
