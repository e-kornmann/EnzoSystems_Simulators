import axios from 'axios';
import { CredentialType, ReqLogOnType } from '../../../../types/LogOnTypes';

export const pinTerminalCredentials: CredentialType = {
  userName: 'terminal',
  passWord: 'terminal',
};

export const correctPin = import.meta.env.VITE_PINCODE_SUCCEEDED;
export const negBalancePin = import.meta.env.VITE_NEGBALANCE;
export const cardlessSecurityPoint = import.meta.env.VITE_CARDLESS_SECURITY_POINT;
export const merchantId = import.meta.env.VITE_MERCHANT_ID;
export const terminalId = import.meta.env.VITE_TERMINAL_ID;

export const reqBody: ReqLogOnType = { merchantId, terminalId };

const baseURL = import.meta.env.VITE_BASE_API_URL
|| `http://localhost:${import.meta.env.VITE_PORT}/${import.meta.env.VITE_API_BASE_PATH}/v${import.meta.env.VITE_API_VERSION}`;
export const axiosUrl = axios.create({ baseURL });
