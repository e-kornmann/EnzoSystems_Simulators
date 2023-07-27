
import api from '../api';

  const createTransaction = async (accessToken: string, amountToAsk: string | undefined, setTransactionIdApp: React.Dispatch<React.SetStateAction<string>>) => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        }
      };
      const response = await api.post(`/${import.meta.env.VITE_MERCHANT_ID}/${import.meta.env.VITE_TERMINAL_ID}/transactions`, {
        amountToPay: Number(amountToAsk),
        locale: "nl-NL",
        currency: "EUR",
        reference: "abcdefg"
      }, config);
      setTransactionIdApp(response.data.transactionId);
    } catch (error) {
      setTransactionIdApp('');
      console.error('Unable to create transaction:', error);
    }
  };


export default createTransaction;


