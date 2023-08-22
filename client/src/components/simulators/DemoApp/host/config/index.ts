import { CredentialType, ReqLogOnType } from "../../../../../types/LogOnTypes"


export const scannerCredentials: CredentialType = {
 userName: import.meta.env.VITE_SCAN_DEVICE_USERNAME,
 passWord: import.meta.env.VITE_SCAN_DEVICE_PASSWORD,
//  passWord: import.meta.env.VITE_HOST_PASSWORD,
}

export const reqBody: ReqLogOnType = {
 deviceId: import.meta.env.VITE_SCAN_DEVICE_ID, 
}