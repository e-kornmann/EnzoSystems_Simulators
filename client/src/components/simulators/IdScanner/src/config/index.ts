type CredentialType = {
  userName: string,
  passWord: string,
};

type ReqLogOnType = {
  hostId?: string,
  merchantId?: string,
  terminalId?: string,
  deviceId?: string
};

export const scannerCredentials: CredentialType = {
  userName: import.meta.env.VITE_ID_SCANNER_USERNAME,
  passWord: import.meta.env.VITE_ID_SCANNER_PASSWORD,
//  passWord: import.meta.env.VITE_HOST_PASSWORD,
};

export const reqBody: ReqLogOnType = {
  deviceId: import.meta.env.VITE_ID_SCANNER_ID,
};
