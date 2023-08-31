

import pinApi from '../../../../api/pinApi';
import { IntlConfigType } from '../../../../types/IntlConfigType';

function processAmount(amountToPay: string | undefined): number {
  if (amountToPay) {
    const sanitizedAmount = amountToPay.replace(/[€$]/g, '').replace(/[^0-9,.]/g, '');

    const numberWithSeparatedDecimals = sanitizedAmount.replace(/,(?=[^,]*,)/g, '|');

    // Replace the last comma (if any) with a decimal point
    const numberWithDecimal = numberWithSeparatedDecimals.replace(',', '.');
    
    // Convert the final string to a number
    const finalAmount = parseFloat(numberWithDecimal);
  return finalAmount*100;
}
return 0
}

  const createTransaction = async (accessToken: string, amountToPay: string | undefined, setTransactionIdApp: React.Dispatch<React.SetStateAction<string>>, intlConfig: IntlConfigType) => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        }
      };
      const response = await pinApi.post(`/${import.meta.env.VITE_MERCHANT_ID}/${import.meta.env.VITE_TERMINAL_ID}/transactions`, {
        amountToPay: processAmount(amountToPay),
        locale: intlConfig.locale,
        currency: intlConfig.currency,
        reference: "abcdefg"
      }, config);
      setTransactionIdApp(response.data.transactionId);
    } catch (error) {
      setTransactionIdApp('');
      console.error('Unable to create transaction:', error);
    }
  };


export default createTransaction;


