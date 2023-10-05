import { AxiosInstance } from 'axios';
import { useCallback, useState } from 'react';
import CurrencyCode from '../src/types/CurrencyTypes';
import Locale from '../src/types/LocaleTypes';
import { ReqLogOnType } from '../src/types/LogOnTypes';
import { GetTransactionDetailsType } from '../src/types/getTransactionDetails';

const initialReceipt: GetTransactionDetailsType = {
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
  const [transactionDetails, setTransactionDetails] = useState<GetTransactionDetailsType>(initialReceipt);

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
      await axiosUrl.put(`/transactions/${transactionId}`, config)
        .then(response => setTransactionDetails(response.data));
    } catch (error) {
      console.error('Unable to get transaction:', error);
    }
    return { transactionDetails, getTransaction };
  }, [accessToken, axiosUrl, transactionDetails, transactionId]);
  return { transactionDetails, getTransaction };
};

export default useGetTransaction;
