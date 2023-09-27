import axios from 'axios';
import { PinTerminalStatus } from '../types';
import { axiosUrl, reqBody } from '../Config';

const updateTransaction = async (
  accessToken: string,
  transactionId: string,
  amountPaid: number,
  setStatus: React.Dispatch<React.SetStateAction<PinTerminalStatus>>,
) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axiosUrl.put(
      `/${reqBody.merchantId}/${reqBody.terminalId}/transactions/${transactionId}`,
      {
        action: 'FINISH',
        amountPaid,
        scheme: 'MASTERCARD',
        pan: '5678542365654321',
      },
      config,
    );
    return response.status;
  } catch (error) {
    setStatus(PinTerminalStatus.SERVER_ERROR);

    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    console.error('Unable to make payment:', error);
    return undefined;
  }
};

export default updateTransaction;
