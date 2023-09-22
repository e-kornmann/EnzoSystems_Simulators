import axios from 'axios';
import idScanApi from '../../../../../api/idScannerApi';
import { IdType } from '../types/IdType';

const changeDeviceStatus = async (token: string, changeToThisState: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${token}`,
      },
    };
    const response = await idScanApi.put(
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
    const response = await idScanApi.get(
      '/active-session/', // longPollingMS=250&result=NO_ACTIVE_SESSION',
      config,
    );
    return response.data.result ? response.data.result : response.data.metadata;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response);
    }
    console.error('Unable to get session:', error);
    return undefined;
  }
};

const putScannedData = async (token: string, idData: IdType) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${token}`,
      },
    };
    const response = await idScanApi.put(
      '/active-session',
      {
        data: {
          ...idData,
          dateOfBirth: idData.dateOfBirth?.slice(2),
          dateOfExpiry: idData.dateOfExpiry?.slice(2),
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

const stopSession = async (token: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${token}`,
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

export { putScannedData, getSession, stopSession, changeDeviceStatus };
