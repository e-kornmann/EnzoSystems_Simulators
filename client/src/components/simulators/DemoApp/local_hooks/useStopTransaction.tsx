import { AxiosInstance } from 'axios';
import { useCallback } from 'react';
import { ReqLogOnType } from '../src/types/LogOnTypes';

const useStopTransaction = (accessToken: string | undefined, transactionId: string | undefined, reqBody: ReqLogOnType, axiosUrl: AxiosInstance) => {
  const stopTransaction = useCallback(async () => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      };
      await axiosUrl.put(`/transactions/${transactionId}`, { action: 'STOP' }, config);
    } catch (error) {
      console.error('Unable to stop transaction:', error);
    }
  }, [accessToken, axiosUrl, transactionId]);
  return { stopTransaction };
};

export default useStopTransaction;
