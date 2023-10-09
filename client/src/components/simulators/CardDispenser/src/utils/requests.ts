import axios from 'axios';
import { axiosUrl } from '../config';
import SESSIONSTATUS from '../enums/SessionStatus';
import CardType from '../types/CardType';
import { APPSETTINGS, DEVICESTATUSOPTIONS } from '../enums/SettingEnums';
import { DeviceStateType } from '../types/DeviceStateType';

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
    console.error(deviceState[APPSETTINGS.DEVICE_STATUS] === DEVICESTATUSOPTIONS.CONNECTED ? `Unable to connect: ${error}` : `Error: ${error} error`);
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

const putSessionStatus = async (token: string, command: SESSIONSTATUS) => {
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
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    console.error('Error:', error);
    return error;
  }
};

const putSessionData = async (token: string, data: CardType) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${token}`,
      },
    };
    const response = await axiosUrl.put('/active-session', { data }, config);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    console.error('Error:', error);
    return error;
  }
};

export { putSessionData, getSession, changeDeviceStatus, putSessionStatus };
