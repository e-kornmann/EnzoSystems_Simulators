import { useCallback } from 'react';
import api from '../api/pinApi';
import { ReqLogOnType } from '../types/LogOnTypes';

const useStopTransaction = (accessToken: string, reqBody: ReqLogOnType, transactionId: string | undefined) => {
  const stopTransaction = useCallback(async () => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        }
      };
      await api.put(`/${reqBody.merchantId}/${reqBody.terminalId}/transactions/${transactionId}`, {
        action: "STOP"
      }, config);
    } catch (error) {
      console.error('Unable to stop transaction:', error);
    }
  }, [accessToken, reqBody, transactionId]);
  return { stopTransaction };
};

export default useStopTransaction;
