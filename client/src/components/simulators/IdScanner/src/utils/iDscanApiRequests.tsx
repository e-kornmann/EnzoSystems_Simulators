import axios from 'axios';
import idScanApi from '../../../../../api/idScannerApi';
import { IdType } from '../types/IdType';

const getSession = async (accessToken: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await idScanApi.get(
      '/active-session/', // longPollingMS=250&result=NO_ACTIVE_SESSION',
      config,
    );
    return response.data.metadata ? response.data.metadata : response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    }
    console.error('Unable to get session:', error);
    return error;
  }
};
const putScannedData = async (accessToken: string, idData: IdType) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await idScanApi.put(
      '/active-session',
      {
        data: {
          ...idData,
          status: 'FINISHED',
        },
      },
      config,
    );
    return response.data.metadata ? response.data.metadata : response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    console.error('Unable to scan ID:', error);
    return error;
  }
};

const stopSession = async (accessToken: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await idScanApi.put(
      '/active-session',
      {
        data: { status: 'STOPPED' },
      },
      config,
    );
    return response.data.metadata ? response.data.metadata : response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    console.error('Unable to stop session', error);
    return error;
  }
};

export { putScannedData, getSession, stopSession };
