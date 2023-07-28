import api from '../../../../api';
import axios from 'axios';
import { AcceptTransactionStateType } from '../types/types';

const acceptTransaction = async(
  token: string,
  setTransactionState: React.Dispatch<
    React.SetStateAction<AcceptTransactionStateType>
  >
): Promise<number | undefined> => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${token}`,
      },
    };
    const response = await api.post(
      `/${import.meta.env.VITE_MERCHANT_ID}/${
        import.meta.env.VITE_TERMINAL_ID
      }/transactions`,
      {
        action: 'RUN',
      },
      config
    );
    setTransactionState({
      transactionId: response.data.transactionId,
      amountToPay: response.data.amountToPay,
    });
    return response.status;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    console.error('Unable to accept transaction:', error);
    return undefined;
  }
}

export default acceptTransaction;
