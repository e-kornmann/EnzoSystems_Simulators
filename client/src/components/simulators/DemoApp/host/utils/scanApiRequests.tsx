import { axiosUrl } from '../../config';

export const getScannedData = async (accessToken: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axiosUrl.get('/scan?longPollingSecs=10', config);
    return response;
  } catch (error) {
    console.error('Error:', error);
    return undefined;
  }
};

export const changeDeviceMode = async (accessToken: string, deviceMode: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axiosUrl.put(
      '/mode',
      {
        mode: deviceMode,
      },
      config,
    );
    return response.status;
  } catch (error) {
    console.error('Unable to set mode:', error);
    return undefined;
  }
};

export const getStatus = async (accessToken: string, currentStatus: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await axiosUrl.get(`/status?currentStatus=${currentStatus}&longPollingSecs=15`, config);
    return response.data.status;
  } catch (error) {
    console.error('Error fetching status:', error);
    return undefined;
  }
};

// if (axios.isAxiosError(error)) {
//   if (error.response) {
//     console.error('Response data:', error.response.data);
//     console.error('Response status:', error.response.status);
//     return null;
//   } else {
//     console.error('Network error:', error);
//     return null;
//   }
// } else {
//   console.error('Unexpected error:', error);
