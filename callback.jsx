import React, { useEffect, useState } from 'react';
import { fetchAccessToken } from '../../api';

const CallbackPage = () => {
  const [status, setStatus] = useState('Exchanging code for token...');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      fetchAccessToken(code).then((data) => {
        if (data?.access_token) {
          setStatus('✅ Connected successfully!');
          // Optional: Store token here
        } else {
          setStatus('❌ Failed to connect.');
        }
      });
    } else {
      setStatus('❌ No code in URL.');
    }
  }, []);

  return <p>{status}</p>;
};

export default CallbackPage;
