import axios from 'axios';
import { axiosUrl } from '../config';
import { DeviceStateType } from '../types/DeviceStateType';
import SESSIONSTATUS from '../enums/SessionStatus';

const changeDeviceStatus = async (token: string, deviceState: DeviceStateType) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUrl.put(
      '/status',
      deviceState,
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

const putSession = async (token: string, command: SESSIONSTATUS) => {
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
    return response.data.metadata ? response.data.metadata : response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    console.error('Error:', error);
    return error;
  }
};

export { putSession, getSession, changeDeviceStatus };
