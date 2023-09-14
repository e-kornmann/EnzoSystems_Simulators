import { useState } from 'react';


// const dontUseLocal = import.meta.env.VITE_EXPORT_MEMO_APP || false
// let pinApi: any;
// if (dontUseLocal) {
//   pinApi = require('../../../../api/pinApi');
// } else {
//   pinApi = require('../local_api/pinApi');
// }
import pinApi from '../local_api/pinApi';
import scanApi from '../local_api/scannerApi';
import idScanApi from '../local_api/idScannerApi';
import { CredentialType, ReqLogOnType } from '../local_types/LogOnTypes';
import { AxiosResponse } from 'axios';

const useLogOn = (credentials: CredentialType, reqBody: ReqLogOnType, apiEndpoint: string) => {
  const [token, setToken] = useState('');

  // take the name of the applicant for the console.log
  const endpointMap = {
    'barcode-scanner': reqBody.deviceId || 'barcode-scanner',
    'id-scanner': reqBody.deviceId || 'id-scanner',
    'payment-terminal': reqBody.hostId || reqBody.terminalId || 'payment-terminal',
    default: 'Endpoint',
  };

  const logOn = async () => {
    try {
      const authCredentials = btoa(`${credentials.userName}:${credentials.passWord}`);
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Basic ${authCredentials}`,
        },
      };
      let response: AxiosResponse;

      switch (apiEndpoint) {
        case 'id-scanner':
          response = await idScanApi.post('/auth', reqBody, config);
          break;
        case 'barcode-scanner':
          response = await scanApi.post('/auth', reqBody, config);
          break;
        case 'payment-terminal':
          response = await pinApi.post('/auth', reqBody, config);
          break;
        default:
          throw new Error('Invalid API endpoint');
      }
      if (!response?.data) {
        throw Error('Missing response data');
      }

      const { accessToken } = response.data;
      setToken(accessToken);

      console.log(`${endpointMap[apiEndpoint]} has been able to get a Token`);
      return true;
    } catch (error) {
      console.error(`Error: ${endpointMap[apiEndpoint as keyof typeof endpointMap]} retrieving authentication token:`, error);
      return false;
    }
  };

  return { token, logOn };
};

export default useLogOn;

