import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
// styled components
import styled, { keyframes } from 'styled-components';
// api
import useLogOn from '../../../local_hooks/useLogOn';
import { scannerCredentials, reqBody, axiosUrl } from '../../config';
// utils
import { changeDeviceStatus, getSession, putScannedData, stopSession } from '../../utils/iDscanApiRequests';
// components
import { AnimatedCrossHair } from './AnimatedCrossHair';
import { SharedLoading } from '../../../local_shared/Loading';
import { SharedSuccesOrFailIcon } from '../../../local_shared/CheckAndCrossIcon';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
import { SettingContext } from '../../contexts/dispatch/SettingContext';
// svg images
import { ReactComponent as QrCodeIconNoCanvas } from '../../../local_assets/id_nocanvas.svg';
// enums
import DEVICESTATUSOPTIONS from '../../enums/DeviceStatusOptions';
import OperationalState from '../../enums/OperationalState';
import Lang from '../../enums/Lang';
import ActionType from '../../enums/ActionTypes';
import ShowIcon from '../../../local_types/ShowIcon';
// types
import KeyType from '../../types/KeyType';
import { DeviceStateType } from '../../types/DeviceStateType';
// translations
import APPSETTINGS from '../../enums/AppSettings';

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
  backgroundColor: theme.colors.text.secondary,
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
const AnimatedId = styled.div<{ $animate: boolean }>`
  position: absolute;
  display: ${props => (props.$animate ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  top: 25%;
  width: 100%;
  height: 45%;
  overflow: hidden;
  z-index: 300;
  & > div {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    gap: 25px;
    width: 93%;
    height: 65%;
    padding: 10% 2%;
    line-height: 0.87em;
    background-color: white;
    animation: ${slideAnimation} 6s ease 0s 1 normal forwards;
    border-radius: 7px;
  `;

const StyledIdHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.3em',
  fontWeight: '500',
  height: '80%',
  color: theme.colors.text.tertiary,
  '& > svg': {
    fill: theme.colors.text.tertiary,
    marginRight: '13px',
    width: '35px',
    height: '20px',
    marginTop: '-3px',
  },
}));

  type Props = {
    cardData: KeyType | undefined;
    appLanguage?: Lang;
  };

const CardDispenserComponent = ({ cardData }: Props) => {
  const { settingState, settingDispatch } = useContext(SettingContext);
  const { statusSettingIsClicked, ...rest } = settingState;
  const appDispatch = useContext(AppDispatchContext);
  const { token, logOn } = useLogOn(scannerCredentials, reqBody, axiosUrl);
  const [nextPoll, setNextPoll] = useState(false);
  const initialSessionRequest = useRef(true);
  const [operationalState, setOperationalState] = useState<OperationalState>(OperationalState.DEVICE_START_UP);
  const [instructionText, setInstructionText] = useState('');

  // This useEffect 'listens' to clicked device settings.
  useEffect(() => {
    if (settingState.statusSettingIsClicked) {
      switch (settingState[APPSETTINGS.DEVICE_STATUS]) {
        case DEVICESTATUSOPTIONS.CONNECTED:
          setNextPoll(false);
          initialSessionRequest.current = true;
          setOperationalState(OperationalState.DEVICE_CONNECT);
          break;
        case DEVICESTATUSOPTIONS.DISCONNECTED:
          setNextPoll(false);
          initialSessionRequest.current = true;
          setOperationalState(OperationalState.DEVICE_DISCONNECT);
          break;
        case DEVICESTATUSOPTIONS.OUT_OF_ORDER:
          setNextPoll(false);
          initialSessionRequest.current = true;
          setOperationalState(OperationalState.DEVICE_OUT_OF_ORDER);
          break;
        default:
          break;
      }
      settingDispatch({ type: 'STATUS_OPTION_IS_CLICKED', payload: false });
      appDispatch({ type: ActionType.CLICKED_CROSS });
    }
  }, [appDispatch, settingDispatch, settingState]);

  const getToken = useCallback(async () => {
    await logOn().then(success => (success
      ? setOperationalState(OperationalState.DEVICE_CONNECT)
      : setOperationalState(OperationalState.API_ERROR)));
  }, [logOn]);

  const getScanSession = useCallback(async () => {
    if (token) {
      const res = await getSession(token);
      if (res.result === 'NO_ACTIVE_SESSION') {
        console.log(`new res: ${res.result}`);
      }
      if (!res) {
        setOperationalState(OperationalState.API_ERROR);
        setNextPoll(false);
        initialSessionRequest.current = true;
      } else {
        // only do next poll if in CONNECTED MODE or WAITING_FOR_ID otherwhise you will get conflicts.
        if (operationalState === OperationalState.DEVICE_KEY_IS_READY) {
          // remove this if when TIMED OUT WORKS
          if (res.result === 'NO_ACTIVE_SESSION') {
            setNextPoll(false);
            console.log('DEVICE TIMED OUT');
            initialSessionRequest.current = true;
            setOperationalState(OperationalState.API_TIMED_OUT);
          } else if (res.metadata?.status === 'TIMED_OUT') {
            setNextPoll(false);
            initialSessionRequest.current = true;
            setOperationalState(OperationalState.API_TIMED_OUT);
          } else if (res.metadata?.status === 'CANCELLING') {
            setNextPoll(false);
            initialSessionRequest.current = true;
            setOperationalState(OperationalState.API_CANCEL);
          } else {
            console.log(res);
            setNextPoll(true);
          }
        }
        if (operationalState === OperationalState.DEVICE_CONNECTED) {
          if (res.metadata?.command === 'CREATE_CARD' && res.metadata?.status === 'ACTIVE') {
            setNextPoll(false);
            initialSessionRequest.current = true;
            appDispatch({ type: ActionType.RECEIVE_KEY_DATA, payload: res.cardData });
            setOperationalState(OperationalState.DEVICE_CREATING_A_KEY);
          } else {
            console.log(res);
            setNextPoll(true);
          }
        }
      }
    }
  }, [appDispatch, operationalState, token]);

  const changeStatus = useCallback(async (changeToThisState: DeviceStateType) => {
    if (token) {
      if (OperationalState.DEVICE_CONNECT) {
        const res = await changeDeviceStatus(token, changeToThisState);
        if (res) {
          if (res.status === DEVICESTATUSOPTIONS.CONNECTED) {
            console.log(`Device succesfully updated device state on the backend: ${res.status}`);
            setOperationalState(OperationalState.DEVICE_CONNECTED);
          }
          if (res.status === DEVICESTATUSOPTIONS.DISCONNECTED) {
            console.log(`Device succesfully updated device state on the backend: ${res.status}`);
            setOperationalState(OperationalState.DEVICE_DISCONNECTED);
          }
          if (res.status === DEVICESTATUSOPTIONS.OUT_OF_ORDER) {
            console.log(`Device succesfully updated device state on the backend: ${res.status}`);
          }
        // if there is no res.data.metadata
        } else if (changeToThisState.status === DEVICESTATUSOPTIONS.CONNECTED) {
          setOperationalState(OperationalState.DEVICE_COULD_NOT_CONNECT);
        } else if (changeToThisState.status === DEVICESTATUSOPTIONS.DISCONNECTED) {
          setOperationalState(OperationalState.DEVICE_COULD_NOT_DISCONNECT);
        }
      }
    }
  }, [token]);

  useEffect(() => {
    let waitTime: number | undefined;
    let intervalId: NodeJS.Timer | null = null;
    const deviceState: DeviceStateType = rest;

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
        changeStatus(deviceState);
        // if setting isn't already connected, then set it.
        if (settingState[APPSETTINGS.DEVICE_STATUS] !== DEVICESTATUSOPTIONS.CONNECTED) {
          settingDispatch({ type: APPSETTINGS.DEVICE_STATUS, payload: DEVICESTATUSOPTIONS.CONNECTED });
        }
        break;
      case OperationalState.DEVICE_DISCONNECT:
        setInstructionText('Disconnecting...');
        waitTime = 1000;
        break;
      case OperationalState.DEVICE_DISCONNECTED:
        setInstructionText('DISCONNECTED');
        if (settingState[APPSETTINGS.DEVICE_STATUS] !== DEVICESTATUSOPTIONS.DISCONNECTED) {
          settingDispatch({ type: APPSETTINGS.DEVICE_STATUS, payload: DEVICESTATUSOPTIONS.DISCONNECTED });
        }
        break;
      case OperationalState.DEVICE_CONNECTED:
        setInstructionText('');
        waitTime = 50000;
        // when in this state getSession is initiated
        break;
      case OperationalState.DEVICE_COULD_NOT_CONNECT:
        setInstructionText('Could not connect');
        waitTime = 3500;
        break;
      case OperationalState.DEVICE_COULD_NOT_DISCONNECT:
        setInstructionText('Could not disconnect');
        waitTime = 3500;
        break;
      case OperationalState.DEVICE_CREATING_A_KEY:
        setInstructionText('Creating a key...');
        waitTime = 2000;
        break;
      case OperationalState.DEVICE_KEY_IS_READY:
        setInstructionText('Key is ready');
        break;
      // not working.. check getSession and Backend.
      case OperationalState.API_CANCEL:
        setInstructionText('Scanning cancelled');
        waitTime = 2500;
        break;
      // not working.. check getSession and Backend.
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
      case OperationalState.DEVICE_OUT_OF_ORDER:
        setInstructionText('OUT OF ORDER');
        if (settingState[APPSETTINGS.DEVICE_STATUS] !== DEVICESTATUSOPTIONS.OUT_OF_ORDER) {
          settingDispatch({ type: APPSETTINGS.DEVICE_STATUS, payload: DEVICESTATUSOPTIONS.OUT_OF_ORDER });
        }
        if (token) {
          // try to change device status on the backend, but stay in this state regardless
          changeStatus(deviceState);
        } else {
          // if there is no token try again to get one. (in case of a restart)
          setOperationalState(OperationalState.DEVICE_START_UP);
        }
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
          case OperationalState.DEVICE_CREATING_A_KEY:
            setOperationalState(OperationalState.DEVICE_KEY_IS_READY);
            break;
          case OperationalState.DEVICE_DISCONNECT:
            changeStatus(deviceState);
            break;
          case OperationalState.DEVICE_COULD_NOT_CONNECT:
          case OperationalState.DEVICE_COULD_NOT_DISCONNECT:
            setOperationalState(OperationalState.API_ERROR);
            break;
          case OperationalState.DEVICE_IS_SCANNING:
            if (token && cardData) {
              const res = await putScannedData(token);
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
  }, [changeStatus, cardData, getToken, operationalState, rest, settingDispatch, settingState, token]);

  const scanIdButtonHandler = async () => {
    setOperationalState(OperationalState.DEVICE_IS_SCANNING);
  };

  /* Repeatedly Get Session Based on operationalState */
  useEffect(() => {
    // while WAITING, send a new "long" poll for a new session (1st request)
    if ((operationalState === OperationalState.DEVICE_CONNECTED
        || operationalState === OperationalState.DEVICE_KEY_IS_READY)
        && initialSessionRequest.current) {
      initialSessionRequest.current = false;
      console.log('initiate getScanSession');
      if (operationalState === OperationalState.DEVICE_KEY_IS_READY) {
        setTimeout(async () => {
          await getScanSession();
        }, 1000);
      } else {
        getScanSession();
      }
      // any subsequent request
    } else if ((operationalState === OperationalState.DEVICE_CONNECTED
        || operationalState === OperationalState.DEVICE_KEY_IS_READY)
        && nextPoll && !initialSessionRequest.current) {
      console.log('next getScanSession');
      setNextPoll(false);
      if (operationalState === OperationalState.DEVICE_KEY_IS_READY) {
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

            <AnimatedId $animate={
              operationalState === OperationalState.DEVICE_IS_SCANNING
              || operationalState === OperationalState.API_SCAN_SUCCESS
              || operationalState === OperationalState.API_SCAN_FAILED
              }>

              <div>
                <StyledIdHeader>
                  <QrCodeIconNoCanvas />
                  {cardData?.roomAccess}
                </StyledIdHeader>

              </div>
            </AnimatedId>

          <AnimatedCrossHair
            animate={
              operationalState === OperationalState.DEVICE_KEY_IS_READY
              || operationalState === OperationalState.DEVICE_IS_SCANNING}
          />
        </ScannerBox>
        <ButtonBox>
          <ScanActionButton
            type="button"
            onClick={scanIdButtonHandler}
            disabled={operationalState !== OperationalState.DEVICE_KEY_IS_READY}
          >
            <QrCodeIconNoCanvas width={15} height={15} />
            <span>
              Take the key
            </span>
          </ScanActionButton>
        </ButtonBox>
      </QrScannerWrapper>
  );
};

export const CardDispenser = memo(CardDispenserComponent);
