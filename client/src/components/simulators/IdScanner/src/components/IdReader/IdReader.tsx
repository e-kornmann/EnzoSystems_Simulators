import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { memo, useCallback, useContext, useEffect, useState } from 'react';
import { ReactComponent as QrCodeIconNoCanvas } from '../../../local_assets/id_nocanvas.svg';

import DeviceStatuses from '../../enums/DeviceStatuses';
import { SharedSuccesOrFailIcon } from '../../../local_shared/CheckAndCrossIcon';
import ShowIcon from '../../../local_types/ShowIcon';
import { OperationalStatuses } from '../../enums/OperationalStatuses';
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
import SharedLoading from '../../../local_shared/Loading';
import { scannerCredentials, reqBody } from '../../config';
import ActionType from '../../enums/ActionTypes';

import AnimatedCrossHair from './AnimatedCrossHair';
import useLogOn from '../../../local_hooks/useLogOn';
import { IdType } from '../../types/IdType';
import { InputFields } from '../LocalAddId/LocalAddId';

import idScanApi from '../../../../../../api/idScannerApi';

const QrScannerWrapper = styled('div')({
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateRows: '16% 16% 1fr 22%',
  rowGap: '2%',
  padding: '8px 0',
});

const InstructionBox = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  '& > span': {
    whiteSpace: 'pre-line',
    textAlign: 'center',
    fontSize: '1.15em',
    lineHeight: '1.23em',
    fontWeight: '500',
  },
});

const IconBox = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: '100%',
});

const ScannerBox = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
});
const ButtonBox = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflowY: 'hidden',
});

const ScanActionButton = styled('button')(({ theme }) => ({
  backgroundColor: 'orange',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '85%',
  height: '50%',
  borderRadius: '4px',
  cursor: 'pointer',
  zIndex: '300',
  '&:active': {
    backgroundColor: theme.colors.buttons.special,
  },
  '& > span': {
    fontWeight: '300',
    fontSize: '0.9em',
    color: 'white',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '70%',
  },
  '& > svg': {
    position: 'relative',
    top: '-1px',
    fill: 'white',
    marginRight: '8px',
  },
  '&:disabled': {
    backgroundColor: theme.colors.buttons.gray,
    cursor: 'inherit',
  },
}));

const slideAnimation = keyframes`
    0% {
      opacity: 0.5;
      transform: translateX(-200vw);
    }
    10%, 80% {
      opacity: 1;
      transform: translateX(0px);
    }
    40%, 60% {
      animation-timing-function: ease-out;
      transform: scale(1);
      transform-origin: center center;
    }
    45%, 55% {
      animation-timing-function: ease-in-out;
      transform: scale(0.91);
    }
    50% {
      animation-timing-function: ease-in-out;
      transform: scale(0.98);
    }
    100% {
      opacity: 0;
      transform: translateX(200vw);
    }
  `;

const AnimatedQr = styled.div<{ $animate: boolean }>`
  position: absolute;
  display: ${props => (props.$animate ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  top: 30%;
  width: 100%;
  height: 40%;
  overflow: hidden;
  z-index: 300;
  & > div {
    width: 60%;
    padding: 7%;
    background-color: white;
    animation: ${slideAnimation} 6s ease 0s 1 normal forwards;
    border-radius: 3px;
     & > svg {
      width: 100%;
      height: 100%;
      fill: ${props => props.theme.colors.text.black};
     }
    }
  `;

  type Props = {
    deviceStatus: DeviceStatuses
    currentId: IdType | undefined;
  };

const IdReaderComponent = ({ deviceStatus, currentId }: Props) => {
  const appDispatch = useContext(AppDispatchContext);
  const [init, setInit] = useState(false);
  const { token, logOn } = useLogOn(scannerCredentials, reqBody, 'id-scanner');
  const [operationalState, setOperationalState] = useState<OperationalStatuses>(OperationalStatuses.DEVICE_START_UP);
  const [instructionText, setInstructionText] = useState('');

  const getToken = useCallback(async () => {
    if (!init) {
      await logOn().then(success => {
        if (success) {
          setTimeout(() => {
            setInit(true);
            setOperationalState(OperationalStatuses.DEVICE_CONNECT);
          }, 500);
        } else {
          setOperationalState(OperationalStatuses.API_ERROR);
        }
      });
    }
  }, [init, logOn]);

  // This useEffect 'listens' to clicked device settings.
  useEffect(() => {
    switch (deviceStatus) {
      case DeviceStatuses.CONNECTED:
        if (init) {
          console.log('A');
          setOperationalState(OperationalStatuses.DEVICE_CONNECT);
        } else {
          console.log('B');
          setOperationalState(OperationalStatuses.DEVICE_START_UP);
        }
        break;
      case DeviceStatuses.DISCONNECTED:
        console.log('C');
        setOperationalState(OperationalStatuses.DEVICE_DISCONNECT);
        break;
      case DeviceStatuses.OUT_OF_ORDER:
        setOperationalState(OperationalStatuses.DEVICE_OUT_OF_ORDER);
        break;
      default:
        break;
    }
  }, [init, deviceStatus]);

  /* Get Session */
  const getSession = useCallback(async () => {
    const config = {
      headers: {
        authorization: `Bearer ${token}`,
      },
      method: 'get',
    };

    try {
      const response = await idScanApi(config);

      return response.data.metadata ? response.data.metadata : response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response;
      }
      console.error('Unable to get session:', error);
      return undefined;
    }
    return undefined;
  }, [token]);

  /* Change device status */
  const changeDeviceStatus = useCallback(async (changeToThisState: string) => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${token}`,
        },
      };
      const response = await idScanApi.put(
        '/status',
        {
          status: changeToThisState,
        },
        config,
      );
      return response;
    } catch (error) {
      console.error('Unable to connect:', error);
      return undefined;
    }
  }, [token]);

  useEffect(() => {
    let waitTime: number | undefined;
    let intervalId: NodeJS.Timer | null = null;
    let checkCounter = 0; // Counter for the number of checks

    switch (operationalState) {
      case OperationalStatuses.DEVICE_START_UP:
        setInstructionText('');
        getToken();
        break;
      case OperationalStatuses.API_ERROR:
        setInstructionText('SERVER ERROR');
        waitTime = 3000;
        break;
      case OperationalStatuses.DEVICE_CONNECT:
        setInstructionText('');
        waitTime = 1000;
        break;
      case OperationalStatuses.DEVICE_DISCONNECT:
        setInstructionText('Disconnecting...');
        waitTime = 1000;
        break;
      case OperationalStatuses.DEVICE_DISCONNECTED:
        setInstructionText('DISCONNECTED');
        if (deviceStatus !== DeviceStatuses.DISCONNECTED) {
          appDispatch({ type: ActionType.SET_DEVICE_STATUS, payload: DeviceStatuses.DISCONNECTED });
        }
        break;
      case OperationalStatuses.DEVICE_OUT_OF_ORDER:
        setInstructionText('OUT OF ORDER');
        if (deviceStatus !== DeviceStatuses.OUT_OF_ORDER) {
          appDispatch({ type: ActionType.SET_DEVICE_STATUS, payload: DeviceStatuses.OUT_OF_ORDER });
        }
        waitTime = 3000;
        break;
      case OperationalStatuses.DEVICE_CONNECTED:
        setInstructionText('CONNECTED');
        waitTime = 250;
        break;
      case OperationalStatuses.DEVICE_COULD_NOT_CONNECT:
        setInstructionText('Could not connect');
        waitTime = 3500;
        break;
      case OperationalStatuses.DEVICE_WAITING_FOR_ID:
        setInstructionText('Ready to scan ID');
        waitTime = 250;
        break;
      case OperationalStatuses.DEVICE_STOPPED:
        setInstructionText('DEVICE DISABLED');
        waitTime = 2500;
        break;
      case OperationalStatuses.DEVICE_TIMED_OUT:
        setInstructionText('TIMED OUT');
        waitTime = 2500;
        break;
      case OperationalStatuses.DEVICE_IS_SCANNING:
        setInstructionText('Scanning...');
        waitTime = 3500;
        break;
      case OperationalStatuses.API_SCAN_FAILED:
        setInstructionText('Scan failed');
        waitTime = 2500;
        break;
      case OperationalStatuses.API_SCAN_SUCCESS:
        setInstructionText('SUCCESS');
        waitTime = 2500;
        break;
      default:
        break;
    }
    if (intervalId) {
      clearInterval(intervalId);
    }
    // when in the designated state, execute ↓ this ↓ AFTER the spicified waittime
    if (waitTime) {
      let response;
      intervalId = setInterval(async () => {
        switch (operationalState) {
          case OperationalStatuses.API_ERROR:
            setOperationalState(OperationalStatuses.DEVICE_START_UP);
            break;
          case OperationalStatuses.DEVICE_CONNECT:
            if (token) {
              response = await changeDeviceStatus('CONNECTED');
              if (response) {
                if (response.status !== 200) {
                  setOperationalState(OperationalStatuses.DEVICE_COULD_NOT_CONNECT);
                } else if (response.status === 200) {
                  checkCounter = 0;
                  appDispatch({ type: ActionType.SET_DEVICE_STATUS, payload: DeviceStatuses.CONNECTED });
                  setOperationalState(OperationalStatuses.DEVICE_CONNECTED);
                  // update Settings because initial state is OUT_OF_ORDER
                }
              // if response is undefined but token is there, maybe device is out of order?
              } else if (response === undefined) {
                setOperationalState(OperationalStatuses.DEVICE_OUT_OF_ORDER);
              }
            } else {
              // if there is no token try again to get one.
              setOperationalState(OperationalStatuses.DEVICE_START_UP);
            }
            break;
          case OperationalStatuses.DEVICE_DISCONNECT:
            if (token) {
              response = await changeDeviceStatus('DISCONNECTED');
              if (response) {
                if (response.status === 200) {
                  setOperationalState(OperationalStatuses.DEVICE_DISCONNECTED);
                }
              }
            } else {
              // if there is no token try again to get one.
              setOperationalState(OperationalStatuses.DEVICE_START_UP);
            }
            break;
          case OperationalStatuses.DEVICE_CONNECTED:
            checkCounter += 1;
            console.log(checkCounter);
            if (token) {
              // If connected look if scanner needs to be activated
              const sessionDetails = await getSession();
              if (sessionDetails) {
                if (sessionDetails.command === 'SCAN_ID') {
                  setOperationalState(OperationalStatuses.DEVICE_WAITING_FOR_ID);
                }
              }
              // This endpoint need to be called by the device on a regular base to stay in connected state.
              // In case the status is not updated in time, the internal status will fallback to "not_found"
              // Timeout is set to 60000 on backend. Maybe to put checkcounter dynamically
              if (checkCounter >= 200) {
                setOperationalState(OperationalStatuses.DEVICE_CONNECT);
              }
            } else {
              // if there is no token try again to get one.
              setOperationalState(OperationalStatuses.DEVICE_START_UP);
            }
            break;
          case OperationalStatuses.DEVICE_COULD_NOT_CONNECT:
            // If you cannot connect you probarly also cannot set to DISCONNECT...
            // either way i put the code here maybe this state can be deleted.
            if (token) {
              response = await changeDeviceStatus('DISCONNECTED');
              if (response) {
                if (response.status === 200) {
                  setOperationalState(OperationalStatuses.DEVICE_DISCONNECTED);
                }
                // if response is undefined but token is there, maybe device is out of order?
              } else if (response === undefined) {
                setOperationalState(OperationalStatuses.DEVICE_OUT_OF_ORDER);
              }
            } else {
              // if there is no token try again to get one.
              setOperationalState(OperationalStatuses.DEVICE_START_UP);
            }
            break;
          case OperationalStatuses.DEVICE_OUT_OF_ORDER:
            if (token) {
              response = await changeDeviceStatus('OUT_OF_ORDER');
              if (response) {
                if (response.status === 200) {
                  setOperationalState(OperationalStatuses.API_ERROR);
                }
              }
            } else {
              // if there is no token try again to get one.
              setOperationalState(OperationalStatuses.DEVICE_START_UP);
            }
            break;
          case OperationalStatuses.DEVICE_WAITING_FOR_ID:
            if (token) {
              // const newMode = await getSession(token);
              // if (newMode.status === 'STOPPED') {
              //   setOperationalState(OperationalStatuses.DEVICE_STOPPED);
              // }
              // if (newMode.status === 'TIMED_OUT') {
              //   setOperationalState(OperationalStatuses.DEVICE_TIMED_OUT);
              // }
            } else {
              checkCounter += 1;
            }
            // either way set to TIMEDOUT
            if (checkCounter >= 13000) {
              setOperationalState(OperationalStatuses.DEVICE_TIMED_OUT);
            }
            break;
          case OperationalStatuses.DEVICE_IS_SCANNING:
            // if (token && currentId) {
            //   const res = await putScannedData(token, currentId.name);
            //   if (res === 200) {
            //     setOperationalState(OperationalStatuses.API_SCAN_SUCCESS);
            //   } else {
            //     console.log(res);
            //     setOperationalState(OperationalStatuses.API_SCAN_FAILED);
            //   }
            // } else {
            //   // if there is no token try again to get one. (and start over)
            //   setOperationalState(OperationalStatuses.DEVICE_START_UP);
            // }
            break;
          case OperationalStatuses.DEVICE_STOPPED:
          case OperationalStatuses.DEVICE_TIMED_OUT:
          case OperationalStatuses.API_SCAN_SUCCESS:
          case OperationalStatuses.API_SCAN_FAILED:
            if (init === false) setOperationalState(OperationalStatuses.API_ERROR);
            else setOperationalState(OperationalStatuses.DEVICE_CONNECT);
            break;
          default:
            break;
        }
      }, waitTime);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [appDispatch, changeDeviceStatus, currentId, deviceStatus, getSession, getToken, init, operationalState, token]);

  const scanQrButtonHandler = async () => {
    setOperationalState(OperationalStatuses.DEVICE_IS_SCANNING);
  };

  return (
      <QrScannerWrapper>
        <InstructionBox>
          {/* {Show loading dots by start-up} */}
          {((operationalState === OperationalStatuses.DEVICE_START_UP) || (operationalState === OperationalStatuses.DEVICE_CONNECT))
          && <SharedLoading/>}
          <span> {instructionText}</span>
        </InstructionBox>
        <IconBox>
          { operationalState === OperationalStatuses.API_SCAN_SUCCESS
          && <SharedSuccesOrFailIcon checkOrCrossIcon={ShowIcon.CHECK} width={30} height={30} /> }
          { operationalState === OperationalStatuses.API_SCAN_FAILED
          && <SharedSuccesOrFailIcon checkOrCrossIcon={ShowIcon.CROSS} width={30} height={30} /> }
        </IconBox>
        <ScannerBox>

            <AnimatedQr $animate={
              operationalState === OperationalStatuses.DEVICE_IS_SCANNING
              || operationalState === OperationalStatuses.API_SCAN_SUCCESS
              || operationalState === OperationalStatuses.API_SCAN_FAILED
              }>
              <div><QrCodeIconNoCanvas /></div>
            </AnimatedQr>

          <AnimatedCrossHair
            animate={
              operationalState === OperationalStatuses.DEVICE_WAITING_FOR_ID
              || operationalState === OperationalStatuses.DEVICE_IS_SCANNING}
          />
        </ScannerBox>
        <ButtonBox>
          <ScanActionButton
            type="button"
            onClick={scanQrButtonHandler}
            disabled={!currentId || !currentId[InputFields.DOCUMENT_NR]
              || !currentId[InputFields.NAME_PRIMARY]
              || operationalState !== OperationalStatuses.DEVICE_WAITING_FOR_ID
            }
          >
            <QrCodeIconNoCanvas width={15} height={15} />
            <span>
              {((!currentId || !currentId[InputFields.DOCUMENT_NR])
                ? 'No Ids'
                : `Scan: ${currentId[InputFields.DOCUMENT_NR]}`)}
            </span>
          </ScanActionButton>
        </ButtonBox>
      </QrScannerWrapper>
  );
};

export const IdReader = memo(IdReaderComponent);
