import api from '../../../../api/pinApi';



  const stopTransaction = async (accessToken: string, transactionId: string, setIsActive: React.Dispatch<React.SetStateAction<boolean>>, getTransactionId: () => void) => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        }
      };
      await api.put(`/${import.meta.env.VITE_MERCHANT_ID}/${import.meta.env.VITE_TERMINAL_ID}/transactions/${transactionId}`, {
        action: "STOP"
      }, config)
      .then(() => {
        getTransactionId();
        setIsActive(false);
      })
    } catch (error) {
      console.error('Unable to stop transaction:', error);
    }
  };

export default stopTransaction;

