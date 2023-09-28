import axios from 'axios';

type CredentialType = {
  userName: string,
  passWord: string,
};

type ReqLogOnType = {
  deviceId: string
};

export const scannerCredentials: CredentialType = {
  userName: import.meta.env.VITE_CARD_DISPENSER_USERNAME,
  passWord: import.meta.env.VITE_CARD_DISPENSER_PASSWORD,
};

export const reqBody: ReqLogOnType = {
  deviceId: import.meta.env.VITE_CARD_DISPENSER_DEVICE_ID,
};
const baseURL = import.meta.env.VITE_CARD_DISPENSER_BACKEND_URL || import.meta.env.VITE_CARD_DISPENSER_LOCAL_BASE_URL || 'update .env file';
export const axiosUrl = axios.create({ baseURL });
