import { useState } from 'react';
import pinApi from '../api/pinApi';
import { CredentialType, ReqLogOnType } from '../types/LogOnTypes';

const useLogOn = (credentials: CredentialType, reqBody: ReqLogOnType ) => {
  const [token, setToken] = useState('');

  const logOn = async () => {
    try {
       const authCredentials = btoa(`${credentials.userName}:${credentials.passWord}`)
       const config = {
            headers: {
              contentType: 'application/json',
              authorization: `Basic ${authCredentials}`
            }
          };
      const response = await pinApi.post('/auth', reqBody, config);
      setToken(response.data.accessToken);
      return true;
    } catch (error) {
      console.error(`${reqBody.hostId ? reqBody.hostId : reqBody.terminalId} is unable to get token:`, error);
      return false;
    }
  }

  return { token, logOn };
};

export default useLogOn;
