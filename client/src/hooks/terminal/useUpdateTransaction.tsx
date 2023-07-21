import { useState } from 'react';
import api from '../../api';

const useAcceptTransaction = (transactionId: string, accessToken: string, amountPaid: number) => {
  const [isUpdatedTransaction, setIsUpdatedTransaction] = useState(false);

  const updateTransaction = async () => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await api.put(
        `/${import.meta.env.VITE_MERCHANT_ID}/${
          import.meta.env.VITE_TERMINAL_ID
        }/transactions/${transactionId}`,
        {
          action: 'FINISH',
          amountPaid,
          scheme: 'MASTERCARD',
          pan: '5678542365654321',
        },
        config
      );
      response.status === 200 ? setIsUpdatedTransaction(true) : null;
    } catch (error) {
      setIsUpdatedTransaction(false);
      console.error('Unable to make payment:', error);
    }
  };

  return { isUpdatedTransaction, updateTransaction };
};
export default useAcceptTransaction;
