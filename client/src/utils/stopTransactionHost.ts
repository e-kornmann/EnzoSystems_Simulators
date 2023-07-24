import api from '../api';



  const stopTransaction = async (accessToken: string, transactionId: string, setIsActive: React.Dispatch<React.SetStateAction<boolean>>, reset: () => void) => {
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
        reset();
        setIsActive(false);
      })
    } catch (error) {
      console.error('Unable to stop transaction:', error);
    }
  };

export default stopTransaction;


