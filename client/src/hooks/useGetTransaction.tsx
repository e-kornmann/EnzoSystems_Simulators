import { AxiosInstance } from 'axios';
import { useCallback, useState } from 'react';
import { GetTransactionDetails } from '../components/simulators/PaymentDevice/types';
import CurrencyCode from '../types/CurrencyTypes';
import Locale from '../types/LocaleTypes';
import { ReqLogOnType } from '../types/LogOnTypes';

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
};

const useGetTransaction = (accessToken: string | undefined, transactionId: string, reqBody: ReqLogOnType, axiosUrl: AxiosInstance) => {
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
        },
      };
      await axiosUrl.put(`/${reqBody.merchantId}/${reqBody.terminalId}/transactions/${transactionId}`, config)
        .then(response => setTransactionDetails(response.data));
    } catch (error) {
      console.error('Unable to get transaction:', error);
    }
    return { transactionDetails, getTransaction };
  }, [accessToken, axiosUrl, reqBody.merchantId, reqBody.terminalId, transactionDetails, transactionId]);
  return { transactionDetails, getTransaction };
};

export default useGetTransaction;
