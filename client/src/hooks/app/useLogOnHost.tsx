import { useState } from 'react';
import api from '../../api';

const useLogOnHost = () => {
  const [hostToken, setToken] = useState('');

  const logOn = async () => {
    try {
       const credentials = btoa('host:host')
       const config = {
            headers: {
              contentType: 'application/json',
              authorization: `Basic ${credentials}`
            }
          };
      const response = await api.post('/auth',
        { hostId: import.meta.env.VITE_HOST_ID },
        config
      )
      setToken(response.data.accessToken);
    } catch (error) {
      console.error('Unable to get token:', error);
    }
  };

  return { hostToken, logOn };
};

export default useLogOnHost;