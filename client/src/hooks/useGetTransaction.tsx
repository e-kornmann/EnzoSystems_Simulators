import { useCallback, useState } from 'react';
import { GetTransactionDetails } from '../components/simulators/PaymentDevice/types';
import api from '../api/pinApi';
import { CurrencyCode } from '../types/CurrencyTypes';
import { Locale } from '../types/LocaleTypes';

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

const useGetTransaction = (accessToken: string, transactionId: string) => {
  const [transactionDetails, setTransactionDetails] = useState<GetTransactionDetails>(initialReceipt);
  

  const getTransaction = useCallback(async () => {
    if (transactionId === '') {
      setTransactionDetails(initialReceipt);
      return { transactionDetails, getTransaction };
    }
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        }
      };
      await api.get(`/${import.meta.env.VITE_MERCHANT_ID}/${import.meta.env.VITE_TERMINAL_ID}/transactions/${transactionId}`, config)
       .then(response => setTransactionDetails(response.data));
    } catch (error) {
        console.error('Unable to get transaction:', error);
    }
  }, [accessToken, transactionDetails, transactionId])

  return { transactionDetails, getTransaction };
};

export default useGetTransaction;