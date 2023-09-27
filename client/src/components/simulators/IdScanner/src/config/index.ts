import axios from 'axios';

type CredentialType = {
  userName: string,
  passWord: string,
};

type ReqLogOnType = {
  deviceId: string
};

export const scannerCredentials: CredentialType = {
  userName: import.meta.env.VITE_ID_SCANNER_USERNAME,
  passWord: import.meta.env.VITE_ID_SCANNER_PASSWORD,
};

export const reqBody: ReqLogOnType = {
  deviceId: import.meta.env.VITE_ID_SCANNER_DEVICE_ID,
};

const baseURL = import.meta.env.VITE_ID_SCANNER_BASE_URL
|| import.meta.env.VITE_ID_SCANNER_LOCAL_BASE_URL;
export const axiosUrl = axios.create({ baseURL });
