
import api from '../api';

function processAmount(amountToAsk: string | undefined): number {
  if (amountToAsk) {
  const sanitizedAmount = amountToAsk.replace(/[^0-9]/g, '');
  
  // Convert the sanitized string to a number
  const numberAmount = parseFloat(sanitizedAmount);


  return numberAmount/100;
}
return 0
}

  const createTransaction = async (accessToken: string, amountToAsk: string | undefined, setTransactionIdApp: React.Dispatch<React.SetStateAction<string>>) => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        }
      };
      const response = await api.post(`/${import.meta.env.VITE_MERCHANT_ID}/${import.meta.env.VITE_TERMINAL_ID}/transactions`, {
        amountToPay: processAmount(amountToAsk),
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


