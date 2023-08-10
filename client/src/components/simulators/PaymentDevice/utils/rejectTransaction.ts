import api from "../../../../api/pinApi";


   export const rejectTransaction = async (accessToken: string, transactionId: string, failOrDecline: string) => {
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
          action: failOrDecline,
        },
        config
      );
    } catch (error) {
      console.error('Unable to make payment:', error);
    }
  };

