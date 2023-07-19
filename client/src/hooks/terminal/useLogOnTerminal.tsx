import { useState } from 'react';
import api from '../../api';

const useLogOnTerminal = () => {
  const [terminalToken, setToken] = useState('');

  const logOn = async () => {
    try {
       const credentials = btoa('terminal:terminal')
       const config = {
            headers: {
              contentType: 'application/json',
              authorization: `Basic ${credentials}`
            }
          };
      const response = await api.post('/auth',
        { merchantId: import.meta.env.VITE_MERCHANT_ID, terminalId: import.meta.env.VITE_TERMINAL_ID },
        config
      )
      setToken(response.data.accessToken);
    } catch (error) {
      console.error('Unable to get token:', error);
    }
  };

  return { terminalToken, logOn };
};

export default useLogOnTerminal;