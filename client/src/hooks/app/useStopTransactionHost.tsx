import api from '../../api';

const useStopTransactionHost = (accessToken: string, transactionId: string,  setIsStoppedTransaction: React.Dispatch<React.SetStateAction<boolean>> ) => {



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
      setIsStoppedTransaction(true);
    } catch (error) {
      console.error('Unable to stop transaction:', error);
    }
  };

  return { stopTransaction };
};

export default useStopTransactionHost;


