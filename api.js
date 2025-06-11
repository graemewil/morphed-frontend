const API_BASE_URL = 'https://morphed-hs-production.up.railway.app';

export const loginWithHubSpot = async () => {
  window.location.href = `${API_BASE_URL}/api/auth/login`;
};

export const fetchAccessToken = async (code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/callback?code=${code}`);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('❌ Failed to fetch token:', err);
    return null;
  }
};

