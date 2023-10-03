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

export const failureSequenceNr = Number(import.meta.env.VITE_CARD_DISPENSER_FAILURE_THRESHOLD);

export const reqBody: ReqLogOnType = {
  deviceId: import.meta.env.VITE_CARD_DISPENSER_DEVICE_ID,
};
const baseURL = import.meta.env.VITE_CARD_DISPENSER_BASE_URL || import.meta.env.VITE_CARD_DISPENSER_LOCAL_BASE_URL || 'updateyour.env-file';
export const axiosUrl = axios.create({ baseURL });
