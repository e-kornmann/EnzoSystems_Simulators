import { CredentialType, ReqLogOnType } from "../../../../types/LogOnTypes";

export const pinTerminalCredentials: CredentialType = {
 userName: 'terminal',
 passWord: 'terminal',
}

export const reqBody: ReqLogOnType = {
 merchantId: import.meta.env.VITE_MERCHANT_ID, 
 terminalId: import.meta.env.VITE_TERMINAL_ID 
}