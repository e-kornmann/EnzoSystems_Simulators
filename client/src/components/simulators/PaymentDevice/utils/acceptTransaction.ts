import axios from 'axios';
import { axiosUrl } from '../Config';
import DEVICESTATUSOPTIONS from '../enums/DeviceStatusOptions';
import { SupportedSchemesType } from '../../../shared/PayProvider';

// const acceptTransaction = async (token: string) => {
//   try {
//     const config = {
//       headers: {
//         contentType: 'application/json',
//         authorization: `Bearer ${token}`,
//       },
//     };
//     const response = await axiosUrl.post(
//       `/${reqBody.merchantId}/${reqBody.terminalId}/transactions`,
//       {
//         action: 'RUN',
//       },
//       config,
//     );
//     return response.data;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       return error.response?.status;
//     }
//     console.error('Unable to accept transaction:', error);
//     return undefined;
//   }
// };

// export default acceptTransaction;

const changeDeviceStatus = async (token: string, changeToThisState: DEVICESTATUSOPTIONS) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUrl.put(
      '/status',
      {
        status: changeToThisState,
      },
      config,
    );
    return response.data.metadata;
  } catch (error) {
    console.error('Unable to connect:', error);
    return undefined;
  }
};

const getSession = async (token: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUrl.get(
      '/active-session',
      config,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response);
    }
    console.error('Unable to get session:', error);
    return undefined;
  }
};

const updateTransaction = async (token: string, amountPaid: number, scheme: SupportedSchemesType) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUrl.put(
      '/active-session',
      {
        data: {
          amountPaid,
          scheme,
          status: 'APPROVED',
          pan: '1234 5678 9012 3456',
        },
      },
      config,
    );
    return response.data.metadata ? response.data.metadata : response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    console.error('Unable to make payment:', error);
    return error;
  }
};

const stopTransaction = async (token: string, command: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUrl.put(
      '/active-session',
      {
        data: {
          status: command,
        },
      },
      config,
    );
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    console.error('Unable to stop transaction:', error);
    return error;
  }
};

export { changeDeviceStatus, getSession, updateTransaction, stopTransaction };
