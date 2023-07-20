import { useState } from 'react';

import api from '../../api';
import { Status } from '../../components/simulators/PaymentDevice';


type transactionStateType = {
  transactionId: string;
}



const useAcceptTransaction = (accessToken: string, setStatus: React.Dispatch<React.SetStateAction<Status>>) => {

  const [transactionState, setTransactionState] = useState<transactionStateType>({ transactionId: ''});

  const acceptTransaction = async () => {
    try {
       const config = {
            headers: {
              contentType: 'application/json',
              authorization: `Bearer ${accessToken}`,
              
            }
          };
      const response = await api.post(`/${import.meta.env.VITE_MERCHANT_ID}/${import.meta.env.VITE_TERMINAL_ID}/transactions`,{ 
        action: "RUN"
      }, config
      )
      setTransactionState(response.data);
      setStatus(Status.CHOOSE_METHOD);
    } catch (error) {
      console.error('Unable to accept transaction:', error);
    }
  };

  return { transactionState, acceptTransaction };
};

export default useAcceptTransaction;


