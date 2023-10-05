import { useState } from 'react';
import { AxiosInstance } from 'axios';
import { CredentialType, ReqLogOnType } from '../types/LogOnTypes';

const useLogOn = (credentials: CredentialType, reqBody: ReqLogOnType, axiosUrl: AxiosInstance) => {
  const [token, setToken] = useState(undefined);

  // take the name of the issuer for the console.log
  const issuer = reqBody.deviceId || reqBody.hostId || 'Device';

  const logOn = async () => {
    try {
      const authCredentials = btoa(`${credentials.userName}:${credentials.passWord}`);
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Basic ${authCredentials}`,
        },
      };
      const response = await axiosUrl.post('/auth', reqBody, config);
      if (!response?.data) {
        throw Error('Missing response data');
      }
      const { accessToken } = response.data;
      setToken(accessToken);
      console.log(`${issuer} has been able to get a Token: ${accessToken}`);
      return true;
    } catch (error) {
      console.error(`Error: ${issuer} is unable to get authentication token:`, error);
      return false;
    }
  };

  return { token, logOn };
};

export default useLogOn;
