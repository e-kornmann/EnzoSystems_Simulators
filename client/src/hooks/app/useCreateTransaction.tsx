import { useState } from 'react';
import api from '../../api';





const useCreateTransaction = (accessToken: string) => {

  const [transactionIdApp, setTransactionIdApp] = useState('');


  const createTransaction = async () => {
    try {
       const accessBtoaToken = btoa(accessToken)
       const config = {
            headers: {
              contentType: 'application/json',
              authorization: `Bearer ${accessBtoaToken}`,
            }
          };
      const response = await api.post(`/${import.meta.env.VITE_MERCHANT_ID}/${import.meta.env.VITE_TERMINAL_ID}/transactions`,{ 
        status: 'RUNNING',
      }, config
      )
      setTransactionIdApp(response.data.transactionId);
    } catch (error) {
      console.error('Unable to get token:', error);
    }
  };

  return { transactionIdApp, createTransaction };
};

export default useCreateTransaction;


