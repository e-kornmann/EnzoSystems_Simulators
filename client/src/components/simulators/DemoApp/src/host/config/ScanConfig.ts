import axios from 'axios';
import { CredentialType, ReqLogOnType } from '../../../../../types/LogOnTypes';

export const scannerCredentials: CredentialType = {
  userName: import.meta.env.VITE_BARCODE_SCANNER_USERNAME,
  passWord: import.meta.env.VITE_BARCODE_SCANNER_PASSWORD,
};

export const reqBody: ReqLogOnType = {
  deviceId: import.meta.env.VITE_BARCODE_SCANNER_DEVICE_ID,
};

const baseURL = import.meta.env.VITE_BARCODE_SCANNER_BASE_URL
|| import.meta.env.VITE_BARCODE_SCANNER_LOCAL_BASE_URL;
export const axiosUrl = axios.create({ baseURL });
