import { useCallback } from 'react';
import api from '../../../../api';

const useStopTransactionTerminal = (accessToken: string, transactionId: string | undefined) => {
  const stopTransaction = useCallback(async () => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        }
      };
      await api.put(`/${import.meta.env.VITE_MERCHANT_ID}/${import.meta.env.VITE_TERMINAL_ID}/transactions/${transactionId}`, {
        action: "STOP"
      }, config);
    } catch (error) {
      console.error('Unable to stop transaction:', error);
    }
  }, [accessToken, transactionId]);
  return { stopTransaction };
};

export default useStopTransactionTerminal;
