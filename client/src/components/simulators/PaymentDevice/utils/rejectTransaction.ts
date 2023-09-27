import { axiosUrl, reqBody } from '../Config';

const rejectTransaction = async (accessToken: string, transactionId: string, failOrDecline: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    };
    await axiosUrl.put(
      `/${reqBody.merchantId}/${reqBody.terminalId}/transactions/${transactionId}`,
      {
        action: failOrDecline,
      },
      config,
    );
  } catch (error) {
    console.error('Unable to make payment:', error);
  }
};

export default rejectTransaction;
