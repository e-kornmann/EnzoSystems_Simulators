import axios from 'axios';
import { CredentialType, ReqLogOnType } from '../../../../types/LogOnTypes';

export const correctPin = import.meta.env.VITE_PINCODE_SUCCEEDED;
export const negBalancePin = import.meta.env.VITE_NEGBALANCE;
export const cardlessSecurityPoint = import.meta.env.VITE_CARDLESS_SECURITY_POINT;

export const pinTerminalCredentials: CredentialType = {
  userName: import.meta.env.VITE_PIN_DEVICE_USERNAME,
  passWord: import.meta.env.VITE_PIN_DEVICE_PASSWORD,
};

export const reqBody: ReqLogOnType = {
  deviceId: import.meta.env.VITE_PIN_DEVICE_TERMINAL_ID,
};

const baseURL = import.meta.env.VITE_PIN_DEVICE_BASE_URL || import.meta.env.VITE_PIN_DEVICE_LOCAL_BASE_URL || 'updateyour.env-file';
export const axiosUrl = axios.create({ baseURL });
