import axios from "axios";
import api from "../../../../api";
import { Status } from "../types/types";

export const updateTransaction = async (accessToken: string, transactionId: string, amountPaid: number, setStatus: React.Dispatch<React.SetStateAction<Status>>) => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      };
        const response = await api.put(
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
      return response.status
    } catch (error) {
      setStatus(Status.SERVER_ERROR);

      if (axios.isAxiosError(error)) {
        return error.response?.status;
      }
      console.error('Unable to make payment:', error);
      return undefined;
      
    }
  };




