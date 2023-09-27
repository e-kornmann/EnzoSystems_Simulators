import { useCallback, useContext, useEffect, useRef, useState } from 'react';
// styled components
import styled, { keyframes } from 'styled-components';
// components
import { SharedLoading } from '../../local_shared/Loading';
import { AnimatedCrossHair } from './AnimatedCrossHair';
import { SharedSuccesOrFailIcon } from '../../local_shared/CheckAndCrossIcon';
// contexts
import { AppContext, SettingModes } from '../utils/settingsReducer';
// svg images
import { ReactComponent as QrCodeIcon } from '../../local_assets/qr_code.svg';
import { ReactComponent as QrCodeIconNoCanvas } from '../../local_assets/qrCode_withoutFrame.svg';
import { ReactComponent as SettingsIcon } from '../../local_assets/settings.svg';
import { ReactComponent as AddIcon } from '../../local_assets/add_qr_code.svg';
// api
import useLogOn from '../../local_hooks/useLogOn';
import { axiosUrl, reqBody, scannerCredentials } from '../config';
// types
import { QrAppModi, QrCode } from '../App';
import ShowIcon from '../../local_types/ShowIcon';
import DeviceStatusOptions from '../enums/DeviceStatusOptions';
import { changeDeviceStatus, getSession, putScannedData, stopSession } from '../utils/scanApiRequests';
// translations
import ts from '../Translations/translations';
import { SharedStyledFooter } from '../../local_shared/DraggableModal/ModalTemplate';

const QrScannerWrapper = styled('div')({
  display: 'grid',
  gridTemplateRows: '14% 16% 1fr 20% auto',
  rowGap: '2%',
});

const InstructionBox = styled('div')({
  const: '100%',
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
    backgroundColor: theme.colors.text.secondary,
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

export enum OperationalState {
  DEVICE_START_UP,
  DEVICE_CONNECT,
  DEVICE_DISCONNECT,
  DEVICE_CONNECTED,
  DEVICE_DISCONNECTED,
  DEVICE_COULD_NOT_CONNECT,
  DEVICE_COULD_NOT_DISCONNECT,
  DEVICE_OUT_OF_ORDER,
  DEVICE_WAITING_FOR_BARCODE,
  API_CANCEL,
  API_TIMED_OUT,
  DEVICE_IS_SCANNING,
  API_SCAN_FAILED,
  API_SCAN_SUCCESS,
  API_ERROR,
}

type Props = {
  modusSetterHandler: (modus: QrAppModi) => void;
  currentQrCode: QrCode;
};

const QrCodeReader = ({ modusSetterHandler, currentQrCode }: Props) => {
  const { state, dispatch } = useContext(AppContext);
  const { token, logOn } = useLogOn(scannerCredentials, reqBody, axiosUrl);
  const [nextPoll, setNextPoll] = useState(false);
  const initialSessionRequest = useRef(true);
  const [operationalState, setOperationalState] = useState<OperationalState>(OperationalState.DEVICE_START_UP);
  const [instructionText, setInstructionText] = useState('');

  // This useEffect 'listens' to clicked device settings.
  useEffect(() => {
    if (state.statusSettingIsClicked) {
      switch (state.statusOption) {
        case DeviceStatusOptions.CONNECTED:
          setOperationalState(OperationalState.DEVICE_START_UP);
          break;
        case DeviceStatusOptions.DISCONNECTED:
          setOperationalState(OperationalState.DEVICE_DISCONNECT);
          break;
        case DeviceStatusOptions.OUT_OF_ORDER:
          setOperationalState(OperationalState.DEVICE_OUT_OF_ORDER);
          break;
        default:
          break;
      }
      dispatch({ type: 'STATUS_OPTION_IS_CLICKED', payload: false });
    }
  }, [dispatch, state.statusOption, state.statusSettingIsClicked]);

  const getToken = useCallback(async () => {
    await logOn().then(success => (success
      ? setOperationalState(OperationalState.DEVICE_CONNECT)
      : setOperationalState(OperationalState.API_ERROR)));
  }, [logOn]);

  const getScanSession = useCallback(async () => {
    if (token) {
      const res = await getSession(token);
      if (!res) {
        setOperationalState(OperationalState.API_ERROR);
        setNextPoll(false);
        initialSessionRequest.current = true;
      } else {
        // only do next poll if in CONNECTED MODE or WAITING_FOR_ID otherwhise you will get conflicts.
        if (operationalState === OperationalState.DEVICE_WAITING_FOR_BARCODE) {
          // remove this if when
          if (res === 'NO_ACTIVE_SESSION') {
            setNextPoll(false);
            initialSessionRequest.current = true;
            setOperationalState(OperationalState.API_TIMED_OUT);
          } else if (res.status === 'TIMED_OUT') {
            setNextPoll(false);
            initialSessionRequest.current = true;
            setOperationalState(OperationalState.API_TIMED_OUT);
          } else if (res.status === 'CANCELLING') {
            setNextPoll(false);
            initialSessionRequest.current = true;
            setOperationalState(OperationalState.API_CANCEL);
          } else {
            console.log(res);
            setNextPoll(true);
          }
        }
        if (operationalState === OperationalState.DEVICE_CONNECTED) {
          if (res.command === 'SCAN_BARCODE' && res.status === 'ACTIVE') {
            setNextPoll(false);
            initialSessionRequest.current = true;
            setOperationalState(OperationalState.DEVICE_WAITING_FOR_BARCODE);
          } else {
            console.log(res);
            setNextPoll(true);
          }
        }
      }
    }
  }, [operationalState, token]);

  const changeStatus = useCallback(async (changeToThisState: DeviceStatusOptions) => {
    if (token) {
      if (OperationalState.DEVICE_CONNECT) {
        const res = await changeDeviceStatus(token, changeToThisState);
        if (res) {
          if (res.status === DeviceStatusOptions.CONNECTED) {
            setOperationalState(OperationalState.DEVICE_CONNECTED);
          }
          if (res.status === DeviceStatusOptions.DISCONNECTED) {
            setOperationalState(OperationalState.DEVICE_DISCONNECTED);
          }
        // if there is no res.data.metadata
        } else if (changeToThisState === DeviceStatusOptions.CONNECTED) {
          setOperationalState(OperationalState.DEVICE_COULD_NOT_CONNECT);
        } else if (changeToThisState === DeviceStatusOptions.DISCONNECTED) {
          setOperationalState(OperationalState.DEVICE_COULD_NOT_DISCONNECT);
        }
      }
    }
  }, [token]);

  useEffect(() => {
    let waitTime: number | undefined;
    let intervalId: NodeJS.Timer | null = null;

    switch (operationalState) {
      case OperationalState.DEVICE_START_UP:
        setInstructionText('');
        waitTime = 1500;
        break;
      case OperationalState.API_ERROR:
        setInstructionText('SERVER ERROR');
        waitTime = 15000;
        break;
      case OperationalState.DEVICE_CONNECT:
        setInstructionText('');
        changeStatus(DeviceStatusOptions.CONNECTED);
        // if setting isn't already connected, then set it.
        if (state.statusOption !== DeviceStatusOptions.CONNECTED) {
          dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: DeviceStatusOptions.CONNECTED });
        }
        break;
      case OperationalState.DEVICE_DISCONNECT:
        setInstructionText('Disconnecting...');
        waitTime = 1000;
        break;
      case OperationalState.DEVICE_DISCONNECTED:
        setInstructionText('DISCONNECTED');
        if (state.statusOption !== DeviceStatusOptions.DISCONNECTED) {
          dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: DeviceStatusOptions.DISCONNECTED });
        }
        break;
      case OperationalState.DEVICE_OUT_OF_ORDER:
        setInstructionText(ts('outOfOrder', state.language));
        if (state.statusOption !== DeviceStatusOptions.OUT_OF_ORDER) {
          dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: DeviceStatusOptions.OUT_OF_ORDER });
        }
        waitTime = 15000;
        break;
      case OperationalState.DEVICE_CONNECTED:
        setInstructionText('');
        waitTime = 50000;
        // when in this state getSession is initiated
        break;
      case OperationalState.DEVICE_COULD_NOT_CONNECT:
        setInstructionText(ts('couldNotConnect', state.language));
        waitTime = 3500;
        break;
      case OperationalState.DEVICE_COULD_NOT_DISCONNECT:
        setInstructionText('Could not disconnect');
        waitTime = 3500;
        break;
      case OperationalState.DEVICE_WAITING_FOR_BARCODE:
        setInstructionText(ts('readyToScan', state.language));
        break;
      case OperationalState.API_CANCEL:
        setInstructionText('Scanning cancelled');
        waitTime = 2500;
        break;
      case OperationalState.API_TIMED_OUT:
        setInstructionText('TIMED OUT');
        waitTime = 2500;
        break;
      case OperationalState.DEVICE_IS_SCANNING:
        setNextPoll(false);
        initialSessionRequest.current = true;
        setInstructionText('Scanning...');
        waitTime = 3500;
        break;
      case OperationalState.API_SCAN_FAILED:
        setInstructionText('Scan failed');
        waitTime = 2500;
        break;
      case OperationalState.API_SCAN_SUCCESS:
        setInstructionText('SUCCESS');
        waitTime = 2500;
        break;
      default:
        break;
    }
    // when in the designated state, execute ↓ this ↓ AFTER the spicified waittime
    if (waitTime) {
      intervalId = setInterval(async () => {
        switch (operationalState) {
          case OperationalState.DEVICE_START_UP:
            if (!token) getToken();
            else setOperationalState(OperationalState.DEVICE_CONNECT);
            break;
          case OperationalState.API_ERROR:
            setOperationalState(OperationalState.DEVICE_START_UP);
            break;
          case OperationalState.DEVICE_CONNECTED:
            // connect again to avoid server TIMEOUT
            setOperationalState(OperationalState.DEVICE_CONNECT);
            break;
          case OperationalState.DEVICE_DISCONNECT:
            changeStatus(DeviceStatusOptions.DISCONNECTED);
            break;
          case OperationalState.DEVICE_COULD_NOT_CONNECT:
          case OperationalState.DEVICE_COULD_NOT_DISCONNECT:
            setOperationalState(OperationalState.API_ERROR);
            break;
          case OperationalState.DEVICE_IS_SCANNING:
            if (token && currentQrCode.data) {
              const res = await putScannedData(token, currentQrCode.data);
              console.log(res);
              if (res) {
                if (res.status === 'FINISHED') {
                  setOperationalState(OperationalState.API_SCAN_SUCCESS);
                } else {
                  console.log(res);
                  setOperationalState(OperationalState.API_SCAN_FAILED);
                }
              }
            }
            break;
          case OperationalState.API_CANCEL:
            if (token) {
              const res = await stopSession(token);
              if (res.status === 'STOPPED') {
                // stop session is succesfull, now try again to connect;
                setOperationalState(OperationalState.DEVICE_CONNECT);
              } else {
                console.log(res);
                setOperationalState(OperationalState.API_ERROR);
              }
            }
            break;
          case OperationalState.API_TIMED_OUT:
          case OperationalState.API_SCAN_SUCCESS:
          case OperationalState.API_SCAN_FAILED:
            // now try again to connect:
            setOperationalState(OperationalState.DEVICE_CONNECT);
            break;
            // initial state:
          case OperationalState.DEVICE_OUT_OF_ORDER:
            if (token) {
              // try to change device status on the backend, but stay in this state regardless
              changeStatus(DeviceStatusOptions.OUT_OF_ORDER);
            } else {
              // if there is no token try again to get one. (in case of a restart)
              setOperationalState(OperationalState.DEVICE_START_UP);
            }
            break;
          default:
            break;
        }
      }, waitTime);
    }
    return () => {
      if (intervalId) {
        clearInterval(Number(intervalId));
      }
    };
  }, [changeStatus, currentQrCode.data, dispatch, getToken, operationalState, state.language, state.statusOption, token]);

  const scanQrButtonHandler = async () => {
    setOperationalState(OperationalState.DEVICE_IS_SCANNING);
  };

  /* Repeatedly Get Session Based on operationalState */
  useEffect(() => {
    // while WAITING, send a new "long" poll for a new session (1st request)
    if ((operationalState === OperationalState.DEVICE_CONNECTED
        || operationalState === OperationalState.DEVICE_WAITING_FOR_BARCODE)
        && initialSessionRequest.current) {
      initialSessionRequest.current = false;
      console.log('initiate getScanSession');
      if (operationalState === OperationalState.DEVICE_WAITING_FOR_BARCODE) {
        setTimeout(async () => {
          await getScanSession();
        }, 1000);
      } else {
        getScanSession();
      }
      // any subsequent request
    } else if ((operationalState === OperationalState.DEVICE_CONNECTED
        || operationalState === OperationalState.DEVICE_WAITING_FOR_BARCODE)
        && nextPoll && !initialSessionRequest.current) {
      console.log('next getScanSession');
      setNextPoll(false);
      if (operationalState === OperationalState.DEVICE_WAITING_FOR_BARCODE) {
        setTimeout(async () => {
          await getScanSession();
        }, 1000);
      } else {
        getScanSession();
      }
    }
  }, [getScanSession, nextPoll, operationalState, token]);

  return (
    <QrScannerWrapper>
      <InstructionBox>
         {/* {Show loading dots by start-up} */}
         {(
           operationalState === OperationalState.DEVICE_START_UP
          || operationalState === OperationalState.DEVICE_CONNECT
          || operationalState === OperationalState.DEVICE_CONNECTED
         )
          && <SharedLoading $isConnected={ operationalState === OperationalState.DEVICE_CONNECTED } />}
        <span> {instructionText}</span>
      </InstructionBox>
      <IconBox>
        { operationalState === OperationalState.API_SCAN_SUCCESS
        && <SharedSuccesOrFailIcon checkOrCrossIcon={ShowIcon.CHECK} width={30} height={30} /> }
        { operationalState === OperationalState.API_SCAN_FAILED
        && <SharedSuccesOrFailIcon checkOrCrossIcon={ShowIcon.CROSS} width={30} height={30} /> }
      </IconBox>
      <ScannerBox>

          <AnimatedQr $animate={
            operationalState === OperationalState.DEVICE_IS_SCANNING
            || operationalState === OperationalState.API_SCAN_SUCCESS
            || operationalState === OperationalState.API_SCAN_FAILED
            }>
            <div><QrCodeIconNoCanvas /></div>
          </AnimatedQr>

        <AnimatedCrossHair
          animate={
            operationalState === OperationalState.DEVICE_WAITING_FOR_BARCODE
            || operationalState === OperationalState.DEVICE_IS_SCANNING}
        />
      </ScannerBox>
      <ButtonBox>
        <ScanActionButton
          type="button"
          onClick={scanQrButtonHandler}
          disabled={
            !currentQrCode.name
            || !currentQrCode.data
            || operationalState !== OperationalState.DEVICE_WAITING_FOR_BARCODE
          }
        >
          <QrCodeIconNoCanvas width={15} height={15} />
          <span>
            {!currentQrCode.name
              ? 'No Qr-Codes'
              : `Scan: ${currentQrCode.name}`}
          </span>
        </ScanActionButton>
      </ButtonBox>
      <SharedStyledFooter>
      <div onClick={() => modusSetterHandler(QrAppModi.SETTINGS)}><SettingsIcon width={16} height={16} /></div>
      <div onClick={() => modusSetterHandler(QrAppModi.QR_CODES)}>
          <QrCodeIcon width={24} height={24} style={{ marginRight: '-5px' }}/>
          QRs
        </div>
        <div onClick={() => modusSetterHandler(QrAppModi.NEW_QR)}>
          <AddIcon width={24} height={24} />
        </div>

      </SharedStyledFooter>
    </QrScannerWrapper>
  );
};

export default QrCodeReader;
