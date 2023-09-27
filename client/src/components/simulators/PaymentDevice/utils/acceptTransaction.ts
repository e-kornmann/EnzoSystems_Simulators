import axios from 'axios';
import { axiosUrl, reqBody } from '../Config';
import { AcceptTransactionStateType } from '../types';

const acceptTransaction = async (
  token: string,
  setTransactionState: React.Dispatch<
  React.SetStateAction<AcceptTransactionStateType>
  >,
): Promise<number | undefined> => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUrl.post(
      `/${reqBody.merchantId}/${reqBody.terminalId}/transactions`,
      {
        action: 'RUN',
      },
      config,
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
};

export default acceptTransaction;
