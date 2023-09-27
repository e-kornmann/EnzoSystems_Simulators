import { AxiosInstance } from 'axios';
import { useCallback } from 'react';
import { ReqLogOnType } from '../types/LogOnTypes';

const useStopTransaction = (accessToken: string | undefined, transactionId: string | undefined, reqBody: ReqLogOnType, axiosUrl: AxiosInstance) => {
  const stopTransaction = useCallback(async () => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      };
      await axiosUrl.put(`/${reqBody.merchantId}/${reqBody.terminalId}/transactions/${transactionId}`, { action: 'STOP' }, config);
    } catch (error) {
      console.error('Unable to stop transaction:', error);
    }
  }, [accessToken, axiosUrl, reqBody.merchantId, reqBody.terminalId, transactionId]);
  return { stopTransaction };
};

export default useStopTransaction;
