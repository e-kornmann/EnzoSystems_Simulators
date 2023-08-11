import { useState } from 'react';
import pinApi from '../api/pinApi';
import scanApi from '../api/scannerApi';
import { CredentialType, ReqLogOnType } from '../types/LogOnTypes';




const useLogOn = (credentials: CredentialType, reqBody: ReqLogOnType, apiEndpoint: string) => {
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

      const accessToken = response.data.accessToken;
      setToken(accessToken);
      return true;
    } catch (error) {
      let endpointName;
      switch (apiEndpoint) {
        case 'barcode-scanner':
          endpointName = reqBody.deviceId;
          break;
        case 'payment-terminal':
          endpointName = reqBody.hostId || reqBody.terminalId;
          break;
        default:
          endpointName = 'Endpoint';
          break;
      }

      console.error(`${endpointName} is unable to get token:`, error);
      return false;
    }
  }

  return { token, logOn };

}



export default useLogOn;
