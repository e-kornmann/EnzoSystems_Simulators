import { useState } from 'react';
import api from '../../api';
import { Status } from '../../components/simulators/PaymentDevice';
import axios from 'axios';
import { TransactionStateType } from './types';




const useAcceptTransaction = (accessToken: string, setStatus: React.Dispatch<React.SetStateAction<Status>>) => {

  const [transactionState, setTransactionState] = useState<TransactionStateType>({ statusCode: undefined, transactionId: '', amountToPay: 0 });

  const acceptTransaction = async () => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,

        }
      };
      const response = await api.post(`/${import.meta.env.VITE_MERCHANT_ID}/${import.meta.env.VITE_TERMINAL_ID}/transactions`, {
        action: "RUN"
      }, config
      )
      setTransactionState({ statusCode: response.status, transactionId: response.data.transactionId, amountToPay: response.data.amountToPay });
      response.status === 200 ? setStatus(Status.CHOOSE_METHOD) : null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setTransactionState({ ...transactionState, statusCode: error.response?.status });
      }
      console.error('Unable to accept transaction:', error);
    }
  }

  return { transactionState, acceptTransaction };
};

export default useAcceptTransaction;

