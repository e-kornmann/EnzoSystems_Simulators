import api from '../../api';

const useStopTransaction = (accessToken: string, transactionId: string,  setIsStoppedTransaction: React.Dispatch<React.SetStateAction<boolean>> ) => {



  const stopTransaction = async () => {
    try {
            const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        }
      };
      const response = await api.put(`/${import.meta.env.VITE_MERCHANT_ID}/${import.meta.env.VITE_TERMINAL_ID}/transactions/${transactionId}`, {
        action: "STOP"
      }, config);
      response.status === 200 ? setIsStoppedTransaction(true) : null;
    } catch (error) {
      console.error('Unable to create transaction:', error);
    }
  };

  return { stopTransaction };
};

export default useStopTransaction;


