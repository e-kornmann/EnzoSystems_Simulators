type CredentialType = {
  userName: string,
  passWord: string,
};

type ReqLogOnType = {
  deviceId: string
};

export const scannerCredentials: CredentialType = {
  userName: import.meta.env.VITE_ID_SCANNER_USERNAME,
  passWord: import.meta.env.VITE_ID_SCANNER_PASSWORD,
};

export const reqBody: ReqLogOnType = {
  deviceId: import.meta.env.VITE_ID_SCANNER_ID,
};
