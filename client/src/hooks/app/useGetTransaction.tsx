import { useState } from 'react';
import api from '../../api';
import { GetTransactionDetails } from '../terminal/types';
import { Locale } from '../../types/LocaleTypes';
import { CurrencyCode } from '../../types/CurrencyTypes';

const initialReceipt: GetTransactionDetails = {
  terminalId: '',
  merchantId: '',
  reference: '',
  amountToPay: 0,
  amountPaid: 0,
  currency: CurrencyCode.EUR,
  locale: Locale.nl_NL,
  receipt: '',
  status: '',
}

const useGetTransaction = (accessToken: string, transactionIdApp: string) => {
  const [transactionDetails, setTransactionDetails] = useState<GetTransactionDetails>(initialReceipt);
  
  const getTransaction = async () => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        }
      };
      const response = await api.get(`/${import.meta.env.VITE_MERCHANT_ID}/${import.meta.env.VITE_TERMINAL_ID}/transactions/${transactionIdApp}`, config);
       setTransactionDetails(response.data);
      

    } catch (error) {
        console.error('Unable to get transaction:', error);
    }
  };

  return { transactionDetails, getTransaction };
};

export default useGetTransaction;


