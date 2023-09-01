import { useState } from 'react';
import pinApi from '../api/pinApi';
import scanApi from '../api/scannerApi';
import { CredentialType, ReqLogOnType } from '../types/LogOnTypes';

const useLogOn = (credentials: CredentialType, reqBody: ReqLogOnType, apiEndpoint: string) => {
  const [token, setToken] = useState('');
  let endpointName: string;

  const logOn = async () => {
    switch (apiEndpoint) {
      case 'barcode-scanner':
        if (reqBody.deviceId) endpointName = reqBody.deviceId;
        else endpointName = apiEndpoint;
        break;
      case 'payment-terminal':
        if (reqBody.hostId) endpointName = reqBody.hostId;
        else if (reqBody.terminalId) endpointName = reqBody.terminalId;
        else endpointName = apiEndpoint;
        break;
      default:
        endpointName = 'Endpoint';
        break;
    }
    try {
      const authCredentials = btoa(`${credentials.userName}:${credentials.passWord}`);
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Basic ${authCredentials}`,
        },
      };
      let response;

      switch (apiEndpoint) {
        case 'barcode-scanner':
          response = await scanApi.post('/auth', reqBody, config);
          break;
        case 'payment-terminal':
          response = await pinApi.post('/auth', reqBody, config);
          break;
        default:
          throw new Error('Invalid API endpoint');
      }

      const { accessToken } = response.data;
      setToken(accessToken);
      console.log(`${endpointName} has been able to get a Token`);
      return true;
    } catch (error) {
      console.error(`${endpointName} is unable to get token:`, error);
      return false;
    }
  };

  return { token, logOn };
};

export default useLogOn;
