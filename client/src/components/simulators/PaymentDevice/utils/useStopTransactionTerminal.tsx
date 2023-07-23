import { Status } from '..';
import api from '../../../../api';



const useStopTransactionTerminal = (accessToken: string, transactionId: string | undefined,  setState: React.Dispatch<React.SetStateAction<Status>> ) => {

  const stopTransaction = async () => {
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
      setState(Status.STOP_TRANSACTION);
    } catch (error) {
      console.error('Unable to stop transaction:', error);
    }
  };
  return { stopTransaction };
};

export default useStopTransactionTerminal;


