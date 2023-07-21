import { useState } from 'react';
import api from '../../api';


const useCreateTransaction = (accessToken: string, amountToAsk: string, setIsStoppedTransaction: React.Dispatch<React.SetStateAction<boolean>>) => {

  const [transactionIdApp, setTransactionIdApp] = useState('');
  const createTransaction = async () => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        }
      };
      const response = await api.post(`/${import.meta.env.VITE_MERCHANT_ID}/${import.meta.env.VITE_TERMINAL_ID}/transactions`, {
        amountToPay: Number(amountToAsk),
        locale: "nl-NL",
        currency: "EUR",
        reference: "abcdefg"
      }, config);
      setTransactionIdApp(response.data.transactionId);
      setIsStoppedTransaction(false);
    } catch (error) {
      console.error('Unable to create transaction:', error);
    }
  };

  return { transactionIdApp, createTransaction };
};

export default useCreateTransaction;


