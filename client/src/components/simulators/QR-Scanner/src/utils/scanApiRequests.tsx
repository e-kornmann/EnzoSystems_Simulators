import axios from 'axios';
import scanApi from '../../local_api/scannerApi';
import DeviceStatusOptions from '../enums/DeviceStatusOptions';

const changeDeviceStatus = async (token: string, changeToThisState: DeviceStatusOptions) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${token}`,
      },
    };
    const response = await scanApi.put(
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
    const response = await scanApi.get(
      '/active-session',
      config,
    );
    return response.data.metadata;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    }
    console.error('Unable to get mode:', error);
    return undefined;
  }
};

const putScannedData = async (token: string, qrData: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${token}`,
      },
    };
    const response = await scanApi.put(
      '/active-session',
      {
        barcodeData: qrData,
      },
      config,
    );
    return response.status;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    console.error('Unable to scan data:', error);
    return error;
  }
};

export { putScannedData, changeDeviceStatus, getSession };
