import { CredentialType, ReqLogOnType } from "../types/LogOnTypes"

export const hostCredentials: CredentialType = {
 userName: 'host',
 passWord: 'host',
}

export const reqBody: ReqLogOnType = {
 hostId: import.meta.env.VITE_HOST_ID, 
}