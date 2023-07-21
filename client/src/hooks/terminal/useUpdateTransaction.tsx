import api from '../../api';
import { Status } from '../../components/simulators/PaymentDevice';


  export const updateTransaction = async (accessToken: string, transactionId: string, amountPaid: number, setStatus: React.Dispatch<React.SetStateAction<Status>>) => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      };
        await api.put(
        `/${import.meta.env.VITE_MERCHANT_ID}/${
          import.meta.env.VITE_TERMINAL_ID
        }/transactions/${transactionId}`,
        {
          action: 'FINISH',
          amountPaid: amountPaid,
          scheme: 'MASTERCARD',
          pan: '5678542365654321',
        },
        config
      );
      setStatus(Status.SUCCESS);
    } catch (error) {
      setStatus(Status.SERVER_ERROR);
      console.error('Unable to make payment:', error);
    }
  };





