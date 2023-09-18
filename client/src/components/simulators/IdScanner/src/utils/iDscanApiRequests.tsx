import axios from 'axios';
import { format, parseISO } from 'date-fns';
import idScanApi from '../../../../../api/idScannerApi';
import { IdType } from '../types/IdType';

// const changeDeviceStatus = useCallback( async(accessToken: string, changeToThisState: string) => {
//   try {
//     const config = {
//       headers: {
//         contentType: 'application/json',
//         authorization: `Bearer ${accessToken}`,
//       },
//     };
//     const response = await idScanApi.put(
//       '/status',
//       {
//         status: changeToThisState,
//       },
//       config,
//     );
//     return response;
//   } catch (error) {
//     console.error('Unable to connect:', error);
//     return undefined;
//   }
// }, []);

const getSession = async (accessToken: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await idScanApi.get(
      '/active-session/', // longPollingMS=250&result=NO_ACTIVE_SESSION',
      config,
    );
    return response.data.metadata ? response.data.metadata : response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    }
    console.error('Unable to get session:', error);
    return undefined;
  }
};
const putScannedData = async (accessToken: string, idData: IdType) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await idScanApi.put(
      '/active-session',
      {

        data: {
          status: 'FINISHED',
          dateOfBirth: idData.dateOfBirth ? format(parseISO(idData.dateOfBirth), 'yyMMdd') : '',
          dateOfExpiry: idData.dateOfExpiry ? format(parseISO(idData.dateOfExpiry), 'yyMMdd') : '',
          documentNumber: 'KeyEncoder789',
          documentType: 'P<',
          issuerCode: 'NLD',
          namePrimary: 'Erik',
          nameSecondary: 'de Vries',
          nationality: 'NLD',
          sex: 'M',
          images: {
            cardHolder: 'imagehere',
            docFront: 'imagehere',
            docBack: 'imagehere',
          },
        },
        // data: {
        //   ...idData,
        //   status: 'FINISHED',
        //   dateOfBirth: idData.dateOfBirth ? format(parseISO(idData.dateOfBirth), 'yyMMdd') : '851212',
        //   dateOfExpiry:
        // },
      },
      config,
    );
    return response.data.metadata ? response.data.metadata : response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    console.error('Unable to scan ID:', error);
    return error;
  }
};

const stopSession = async (accessToken: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await idScanApi.put(
      '/active-session',
      {
        data: { status: 'STOPPED' },
      },
      config,
    );
    return response.status;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.status;
    }
    console.error('Unable to stop session', error);
    return error;
  }
};

// const getDeviceMode = async (accessToken: string, currentModus: string) => {
//   try {
//     const config = {
//       headers: {
//         contentType: 'application/json',
//         authorization: `Bearer ${accessToken}`,
//       },
//     };
//     const response = await idScanApi.get(
//       `/mode?currentMode=${currentModus}&longPollingSecs=15`,
//       config,
//     );
//     return response.data.mode;
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       return error.response;
//     }
//     console.error('Unable to get mode:', error);
//     return undefined;
//   }
// };

export { putScannedData, getSession, stopSession };
