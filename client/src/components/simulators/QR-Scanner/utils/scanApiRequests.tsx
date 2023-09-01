import axios from 'axios';
import scanApi from '../../../../api/scannerApi';

const putScannedData = async (accessToken: string, qrData: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
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

const changeDeviceStatus = async (accessToken: string, changeToThisState: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await scanApi.put(
      '/status',
      {
        status: changeToThisState,
      },
      config,
    );
    return response;
  } catch (error) {
    console.error('Unable to connect:', error);
    return undefined;
  }
};

const getSession = async (accessToken: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
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

// const getDeviceMode = async (accessToken: string, currentModus: string) => {
//   try {
//     const config = {
//       headers: {
//         contentType: 'application/json',
//         authorization: `Bearer ${accessToken}`,
//       },
//     };
//     const response = await scanApi.get(
//       `/mode?currentMode=${currentModus}&longPollingSecs=15`,
//       config,
//     );
//     return response.data.mode;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       return error.response;
//     }
//     console.error('Unable to get mode:', error);
//     return undefined;
//   }
// };

export { putScannedData, changeDeviceStatus, getSession };
