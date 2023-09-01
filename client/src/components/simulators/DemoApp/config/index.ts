import { CredentialType, ReqLogOnType } from '../../../../types/LogOnTypes';

export const hostCredentials: CredentialType = {
  userName: import.meta.env.VITE_HOST_USERNAME,
  passWord: import.meta.env.VITE_HOST_USERNAME,
//  passWord: import.meta.env.VITE_HOST_PASSWORD,
};

export const reqBody: ReqLogOnType = {
  hostId: import.meta.env.VITE_HOST_ID,
};
