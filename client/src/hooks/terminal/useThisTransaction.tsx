import { useState } from 'react';

import api from '../../api';





const useThisTransaction = (accessToken: string) => {

  const [transactionState, setTransactionState] = useState({});


  const getTransaction = async () => {
    try {
       const accessTokenB64 = btoa(accessToken)
       const config = {
            headers: {
              contentType: 'application/json',
              authorization: `Bearer ${accessTokenB64}`,
              
            }
          };
      const response = await api.post(`/${import.meta.env.VITE_MERCHANT_ID}/${import.meta.env.VITE_TERMINAL_ID}/transactions`,{ 
        status: 'RUNNING',
      }, config
      )
      setTransactionState(response.data);
    } catch (error) {
      console.error('Unable to get token:', error);
    }
  };

  return { transactionState, getTransaction };
};

export default useThisTransaction;


