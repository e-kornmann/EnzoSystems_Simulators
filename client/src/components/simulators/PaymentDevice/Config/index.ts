import { CredentialType, ReqLogOnType } from "../../../../types/LogOnTypes";

export const pinTerminalCredentials: CredentialType = {
 userName: 'terminal',
 passWord: 'terminal',

}

export const correctPin = import.meta.env.VITE_PINCODE_SUCCEEDED;
export const negBalancePin = import.meta.env.VITE_NEGBALANCE;
export const cardlessSecurityPoint = import.meta.env.VITE_CARDLESS_SECURITY_POINT;
export const merchantId = import.meta.env.VITE_MERCHANT_ID; 
export const terminalId = import.meta.env.VITE_TERMINAL_ID; 

// use this object below as a passed argument for the useGetTransaction hook
export const reqBody: ReqLogOnType = { merchantId, terminalId }
   