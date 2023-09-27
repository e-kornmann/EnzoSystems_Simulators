import axios from 'axios';
import { CredentialType, ReqLogOnType } from '../../../../types/LogOnTypes';

export const hostCredentials: CredentialType = {
  userName: import.meta.env.VITE_HOST_USERNAME,
  passWord: import.meta.env.VITE_HOST_USERNAME,
};

export const reqBody: ReqLogOnType = {
  hostId: import.meta.env.VITE_HOST_ID,
};

const baseURL = import.meta.env.VITE_BASE_API_URL
|| `http://localhost:${import.meta.env.VITE_PORT}/${import.meta.env.VITE_API_BASE_PATH}/v${import.meta.env.VITE_API_VERSION}`;

export const axiosUrl = axios.create({ baseURL });
