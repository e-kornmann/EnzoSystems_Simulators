import { memo, useCallback, useContext, useEffect, useRef, useState } from 'react';
// styled components
import styled, { css, keyframes } from 'styled-components';
// date-fns
import { format, parseISO } from 'date-fns';
// api
import useLogOn from '../../../local_hooks/useLogOn';
import { scannerCredentials, reqBody, axiosUrl, failureSequenceNr } from '../../config';
// utils
import { changeDeviceStatus, getSession, putSession } from '../../utils/requests';
// components
import { SharedLoading } from '../../../local_shared/Loading';
import { SharedSuccesOrFailIcon } from '../../../local_shared/CheckAndCrossIcon';
import { SharedLoadingDots } from '../../../local_shared/LoadingDots';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
import { SettingContext } from '../../contexts/dispatch/SettingContext';
// svg images
import { ReactComponent as QrCodeIconNoCanvas } from '../../../local_assets/id_nocanvas.svg';
// enums
import OPSTATE from '../../enums/OperationalState';
import { Lang, APPSETTINGS, DEVICESTATUSOPTIONS, FAILPROCESS } from '../../enums/SettingEnums';
import AppActions from '../../enums/AppActions';
import ShowIcon from '../../../local_types/ShowIcon';
import SESSIONSTATUS from '../../enums/SessionStatus';
// types
import CardType from '../../types/CardType';
import { DeviceStateType } from '../../types/DeviceStateType';

// translations
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

const slideIn = keyframes`
  0% {
    transform: translateX(-80%);
  }
  100% {
    transform: translateX(0);
  }
`;

const slideBack = keyframes`
0% {
  transform: translateX(0%);
}
100% {
  transform: translateX(-120%);
}
`;
const slideOut = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(200%);
  }
`;

const initialSlide = keyframes`
0% {
  transform: translateX(-200%);
}
100% {
  transform: translateX(-80%);
}
`;

const StyledCardBox = styled('div')({
  position: 'fixed',
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
  top: '20%',
  width: '100%',
  height: '60%',
  zIndex: 300,
  overflowY: 'hidden',
  overflowX: 'hidden',
});

const StyledCard = styled.div<{ $slideIn: boolean, $slideOut: boolean, $slideBack: boolean, $isFaulsy: boolean }>`
  display: grid;
  grid-template-rows: 30% 25% 20% 25%;
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: 12px;
  min-height: 100px;
  max-height: 400px;
  max-width: 600px;
  height: 46%;
  width: 88%;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
  color: ${props => props.theme.colors.text.primary};
  animation: ${props => {
    let animation;
    if (props.$slideBack) {
      animation = slideBack;
    } else if (props.$slideIn) {
      animation = slideIn;
    } else if (props.$slideOut) {
      animation = slideOut;
    } else {
      animation = initialSlide;
    }
    return css`${animation} 1s ease 0s 1 normal forwards`;
  }};
    border-radius: 7px;
    & > div {
      opacity: 0;
      text-decoration: ${props => (props.$isFaulsy ? 'wavy line-through white 2px' : 'none')};
    }
  `;

const textFadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledRoomNumber = styled('div')`
    flex: 1;
    display: flex;
    align-items: flex-end;
    justify-content: center;  
    animation: ${textFadeInAnimation} 0.2s ease 0.75s 1 normal forwards;
    font-size: 1.5em;
    font-weight: 600;
  `;
const StyledAdditionalAccess = styled(StyledRoomNumber)`
    align-items: center;
    animation: ${textFadeInAnimation} 0.2s ease 1.25s 1 normal forwards;
    font-size: 0.75em;
    font-weight: 500;
    text-align: center;
  `;
const StyledStartDate = styled('div')`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;  
    animation: ${textFadeInAnimation} 0.2s ease 1.50s 1 normal forwards;
    font-size: 0.95em;
    font-weight: 500;
    text-align: center;
    font-variant-numeric: tabular-nums;
  `;

const StyledEndDate = styled(StyledStartDate)`
    align-items: flex-start;
    animation: ${textFadeInAnimation} 0.2s ease 1.75s 1 normal forwards;
  `;

  type Props = {
    cardData: CardType;
    appLanguage?: Lang;
  };

const CardDispenserComponent = ({ cardData }: Props) => {
  const { settingState, settingDispatch } = useContext(SettingContext);
  const { statusSettingIsClicked, failProcess, ...rest } = settingState;
  const appDispatch = useContext(AppDispatchContext);
  const { token, logOn } = useLogOn(scannerCredentials, reqBody, axiosUrl);
  const [nextPoll, setNextPoll] = useState(false);
  const initialSessionRequest = useRef(true);
  const [operationalState, setOperationalState] = useState<OPSTATE>(OPSTATE.DEVICE_START_UP);
  const [instructionText, setInstructionText] = useState('');
  const isoParser = useCallback((isostring: string): string | null => format(parseISO(isostring), 'yyyy-MM-dd | HH:mm'), []);
  // This useEffect 'listens' to clicked device settings.
  useEffect(() => {
    if (settingState.statusSettingIsClicked) {
      switch (settingState[APPSETTINGS.DEVICE_STATUS]) {
        case DEVICESTATUSOPTIONS.CONNECTED:
          setNextPoll(false);
          initialSessionRequest.current = true;
          setOperationalState(OPSTATE.DEVICE_CONNECT);
          break;
        case DEVICESTATUSOPTIONS.DISCONNECTED:
          setNextPoll(false);
          initialSessionRequest.current = true;
          setOperationalState(OPSTATE.DEVICE_DISCONNECT);
          break;
        case DEVICESTATUSOPTIONS.OUT_OF_ORDER:
          setNextPoll(false);
          initialSessionRequest.current = true;
          setOperationalState(OPSTATE.DEVICE_OUT_OF_ORDER);
          break;
        default:
          break;
      }
      settingDispatch({ type: 'STATUS_OPTION_IS_CLICKED', payload: false });
      appDispatch({ type: AppActions.CLICKED_CROSS });
    }
  }, [appDispatch, settingDispatch, settingState]);

  const getToken = useCallback(async () => {
    await logOn().then(success => (success
      ? setOperationalState(OPSTATE.DEVICE_CONNECT)
      : setOperationalState(OPSTATE.SERVER_ERROR)));
  }, [logOn]);

  const getScanSession = useCallback(async () => {
    if (token) {
      const res = await getSession(token);
      if (!res) {
        setOperationalState(OPSTATE.SERVER_ERROR);
        setNextPoll(false);
        initialSessionRequest.current = true;
      } else {
        // only do next poll if status is IDLE or CREATING A KEY / DEVICE_KEY_IS_READY otherwhise you will get conflicts.
        if (operationalState === OPSTATE.DEVICE_KEY_IS_READY
          || operationalState === OPSTATE.DEVICE_CREATING_A_KEY) {
          // if you get an NO_ACTIVE_SESSION, session has been TIMED_OUT, reset poll
          if (res.result === 'NO_ACTIVE_SESSION') {
            setNextPoll(false);
            initialSessionRequest.current = true;
            setOperationalState(OPSTATE.API_TIMED_OUT);
          } else if (res.metadata?.status === 'CANCELLING') {
            setNextPoll(false);
            initialSessionRequest.current = true;
            setOperationalState(OPSTATE.API_CANCEL);
          } else {
            console.log(res);
            setNextPoll(true);
          }
        }
        if (operationalState === OPSTATE.DEVICE_IDLE) {
          if (res.metadata?.command === 'CREATE_CARD' && res.metadata?.status === 'ACTIVE') {
            setNextPoll(false);
            initialSessionRequest.current = true;
            appDispatch({ type: AppActions.RECEIVE_CARD_DATA, payload: res.cardData });
            setOperationalState(OPSTATE.DEVICE_CREATING_A_KEY);
          } else {
            console.log(res);
            setNextPoll(true);
          }
        }
      }
    }
  }, [appDispatch, operationalState, token]);

  const endSession = useCallback(async (command: SESSIONSTATUS) => {
    if (token && cardData) {
      const res = await putSession(token, command);
      if (res) {
        if (res.status === 'FINISHED') {
          if (operationalState === OPSTATE.TAKING_THE_KEY) setOperationalState(OPSTATE.KEY_SUCCESSFULLY_TAKEN);
          else setOperationalState(OPSTATE.KEY_SLIDEOUT);
        }
        if (res.status === 'STOPPED') {
          // stop session is succesfull, now try again to connect;
          setOperationalState(OPSTATE.KEY_SLIDEOUT);
        }
      } else if (operationalState === OPSTATE.TAKING_THE_KEY) {
        setOperationalState(OPSTATE.KEY_UNSUCCESSFULLY_TAKEN);
      } else {
        console.log(res);
        setOperationalState(OPSTATE.SERVER_ERROR);
      }
    }
  }, [cardData, operationalState, token]);

  const changeStatus = useCallback(async (changeToThisState: DeviceStateType) => {
    if (token) {
      const res = await changeDeviceStatus(token, changeToThisState);
      if (res) {
        if (res.status === DEVICESTATUSOPTIONS.CONNECTED) {
          console.log(`Device succesfully updated device state: ${res.status}`);
          setOperationalState(OPSTATE.DEVICE_IDLE);
        }
        if (res.status === DEVICESTATUSOPTIONS.DISCONNECTED) {
          console.log(`Device succesfully updated device state: ${res.status}`);
          setOperationalState(OPSTATE.DEVICE_DISCONNECTED);
        }
        if (res.status === DEVICESTATUSOPTIONS.OUT_OF_ORDER) {
          console.log(`Device succesfully updated device state: ${res.status}`);
        }
        // if there is no res.data.metadata
      } else if (changeToThisState.status === DEVICESTATUSOPTIONS.CONNECTED) {
        setOperationalState(OPSTATE.DEVICE_COULD_NOT_CONNECT);
      } else if (changeToThisState.status === DEVICESTATUSOPTIONS.DISCONNECTED) {
        setOperationalState(OPSTATE.DEVICE_COULD_NOT_DISCONNECT);
      }
    }
  }, [token]);

  useEffect(() => {
    let waitTime: number | undefined;
    let intervalId: NodeJS.Timer | null = null;
    const deviceState: DeviceStateType = rest;

    switch (operationalState) {
      case OPSTATE.DEVICE_START_UP:
        setInstructionText('');
        waitTime = 1500;
        break;
      case OPSTATE.DEVICE_CONNECT:
        setInstructionText('');
        changeStatus(deviceState);
        // if setting isn't already connected, then set it.
        if (settingState[APPSETTINGS.DEVICE_STATUS] !== DEVICESTATUSOPTIONS.CONNECTED) {
          settingDispatch({ type: APPSETTINGS.DEVICE_STATUS, payload: DEVICESTATUSOPTIONS.CONNECTED });
        }
        break;
      case OPSTATE.DEVICE_IDLE:
        setInstructionText('');
        waitTime = 50000;
        // when in this state getSession is initiated
        break;
      case OPSTATE.DEVICE_COULD_NOT_CONNECT:
        setInstructionText('Could not connect');
        waitTime = 3500;
        break;
      case OPSTATE.DEVICE_DISCONNECT:
        setInstructionText('Disconnecting...');
        waitTime = 1000;
        break;
      case OPSTATE.DEVICE_DISCONNECTED:
        setInstructionText('DISCONNECTED');
        if (settingState[APPSETTINGS.DEVICE_STATUS] !== DEVICESTATUSOPTIONS.DISCONNECTED) {
          settingDispatch({ type: APPSETTINGS.DEVICE_STATUS, payload: DEVICESTATUSOPTIONS.DISCONNECTED });
        }
        break;
      case OPSTATE.DEVICE_COULD_NOT_DISCONNECT:
        setInstructionText('Could not disconnect');
        waitTime = 3500;
        break;
      case OPSTATE.DEVICE_CREATING_A_KEY:
        setInstructionText('Creating a key...');
        waitTime = 2000;
        break;
      case OPSTATE.DEVICE_KEY_IS_READY:
        setInstructionText('Key is ready');
        break;
      case OPSTATE.DEVICE_KEY_IS_FAULTY:
        setInstructionText('Key creation failed');
        waitTime = 1000;
        break;
      case OPSTATE.API_CANCEL:
        setInstructionText('Cancelling');
        waitTime = 3500;
        break;
      // not working.. check getSession and Backend.
      case OPSTATE.API_TIMED_OUT:
        setInstructionText('TIMED OUT');
        waitTime = 2500;
        break;
      case OPSTATE.TAKING_THE_KEY:
      case OPSTATE.KEY_SLIDEOUT:
        waitTime = 900;
        break;
      case OPSTATE.KEY_SUCCESSFULLY_TAKEN:
        setInstructionText('Key has been taken');
        waitTime = 2000;
        break;
      case OPSTATE.KEY_UNSUCCESSFULLY_TAKEN:
        setInstructionText('ERROR');
        waitTime = 1500;
        break;
      case OPSTATE.SERVER_ERROR:
        setInstructionText('SERVER ERROR');
        waitTime = 15000;
        break;
      case OPSTATE.DEVICE_OUT_OF_ORDER:
        setInstructionText('OUT OF ORDER');
        if (settingState[APPSETTINGS.DEVICE_STATUS] !== DEVICESTATUSOPTIONS.OUT_OF_ORDER) {
          settingDispatch({ type: APPSETTINGS.DEVICE_STATUS, payload: DEVICESTATUSOPTIONS.OUT_OF_ORDER });
        }
        if (token) {
          // try to change device status on the backend, but stay in this state regardless
          changeStatus(deviceState);
        } else {
          // if there is no token try again to get one. (in case of a restart)
          setOperationalState(OPSTATE.DEVICE_START_UP);
        }
        break;
      default:
        break;
    }
    // when in the designated state, execute ↓ this ↓ AFTER the spicified waittime
    if (waitTime) {
      intervalId = setInterval(async () => {
        switch (operationalState) {
          case OPSTATE.DEVICE_START_UP:
            if (!token) getToken();
            // dont try again to get one but try to connect
            else setOperationalState(OPSTATE.DEVICE_CONNECT);
            break;
          case OPSTATE.DEVICE_IDLE:
            // connect again to avoid server TIMEOUT
            setOperationalState(OPSTATE.DEVICE_CONNECT);
            break;
          case OPSTATE.DEVICE_CREATING_A_KEY:
            if (settingState.failProcess === FAILPROCESS.SPORADICALLY) {
              const randomNr = Math.floor(Math.random() * failureSequenceNr) + 1;
              console.log(`randomnummer: ${randomNr}, ${failureSequenceNr}`);
              if (randomNr === failureSequenceNr) {
                setOperationalState(OPSTATE.DEVICE_KEY_IS_FAULTY);
              } else {
                setOperationalState(OPSTATE.DEVICE_KEY_IS_READY);
              }
            } else if (settingState.failProcess === FAILPROCESS.NEVER) {
              setOperationalState(OPSTATE.DEVICE_KEY_IS_READY);
            }
            break;
          case OPSTATE.DEVICE_DISCONNECT:
            changeStatus(deviceState);
            break;
          case OPSTATE.DEVICE_COULD_NOT_CONNECT:
          case OPSTATE.DEVICE_COULD_NOT_DISCONNECT:
            setOperationalState(OPSTATE.SERVER_ERROR);
            break;
          case OPSTATE.DEVICE_KEY_IS_FAULTY:
          case OPSTATE.TAKING_THE_KEY:
            endSession(SESSIONSTATUS.FINISHED);
            break;
          case OPSTATE.API_CANCEL:
            endSession(SESSIONSTATUS.STOPPED);
            break;
          case OPSTATE.API_TIMED_OUT:
          case OPSTATE.KEY_SUCCESSFULLY_TAKEN:
          case OPSTATE.KEY_UNSUCCESSFULLY_TAKEN:
          case OPSTATE.KEY_SLIDEOUT:
            setNextPoll(false);
            initialSessionRequest.current = true;
            appDispatch({ type: AppActions.RECEIVE_CARD_DATA, payload: undefined });
            // now try again to connect:
            setOperationalState(OPSTATE.DEVICE_CONNECT);
            break;
          case OPSTATE.SERVER_ERROR:
            setOperationalState(OPSTATE.DEVICE_START_UP);
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
  }, [changeStatus, cardData, getToken, operationalState, rest, settingDispatch, settingState, token, appDispatch, endSession]);

  const scanIdButtonHandler = async () => {
    setOperationalState(OPSTATE.TAKING_THE_KEY);
  };

  /* Repeatedly Get Session Based on operationalState */
  useEffect(() => {
    // while WAITING, send a new "long" poll for a new session (1st request)
    if ((operationalState === OPSTATE.DEVICE_IDLE
        || operationalState === OPSTATE.DEVICE_KEY_IS_READY)
        && initialSessionRequest.current) {
      initialSessionRequest.current = false;
      console.log('initiate getScanSession');
      if (operationalState === OPSTATE.DEVICE_KEY_IS_READY) {
        setTimeout(async () => {
          await getScanSession();
        }, 1000);
      } else {
        getScanSession();
      }
      // any subsequent request
    } else if ((operationalState === OPSTATE.DEVICE_IDLE
        || operationalState === OPSTATE.DEVICE_KEY_IS_READY)
        && nextPoll && !initialSessionRequest.current) {
      console.log('next getScanSession');
      setNextPoll(false);
      if (operationalState === OPSTATE.DEVICE_KEY_IS_READY) {
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
            operationalState === OPSTATE.DEVICE_START_UP
          || operationalState === OPSTATE.DEVICE_CONNECT
          || operationalState === OPSTATE.DEVICE_IDLE
          )
          && <SharedLoading $isConnected={ operationalState === OPSTATE.DEVICE_IDLE } />}
          <span> {instructionText}</span>
        </InstructionBox>
        <IconBox>
          { operationalState === OPSTATE.KEY_SUCCESSFULLY_TAKEN
          && <SharedSuccesOrFailIcon checkOrCrossIcon={ShowIcon.CHECK} width={30} height={30} /> }
          {(operationalState === OPSTATE.KEY_UNSUCCESSFULLY_TAKEN || operationalState === OPSTATE.DEVICE_KEY_IS_FAULTY)
          && <SharedSuccesOrFailIcon checkOrCrossIcon={ShowIcon.CROSS} width={30} height={30} /> }
          { operationalState === OPSTATE.DEVICE_CREATING_A_KEY && <SharedLoadingDots />}
        </IconBox>
        <ScannerBox>
            <StyledCardBox>
            <StyledCard
              $slideIn={ operationalState === OPSTATE.DEVICE_CREATING_A_KEY
                || operationalState === OPSTATE.DEVICE_KEY_IS_READY
                || operationalState === OPSTATE.DEVICE_KEY_IS_FAULTY}
              $slideOut={ operationalState === OPSTATE.TAKING_THE_KEY
              || operationalState === OPSTATE.KEY_SUCCESSFULLY_TAKEN
              || operationalState === OPSTATE.KEY_UNSUCCESSFULLY_TAKEN
              }
              $slideBack={operationalState === OPSTATE.API_CANCEL
                || operationalState === OPSTATE.API_TIMED_OUT
                || operationalState === OPSTATE.KEY_SLIDEOUT}
              $isFaulsy={operationalState === OPSTATE.DEVICE_KEY_IS_FAULTY || operationalState === OPSTATE.KEY_SLIDEOUT} >
            { (operationalState === OPSTATE.DEVICE_CREATING_A_KEY
            || operationalState === OPSTATE.DEVICE_KEY_IS_READY
            || operationalState === OPSTATE.DEVICE_KEY_IS_FAULTY
            || operationalState === OPSTATE.TAKING_THE_KEY
            || operationalState === OPSTATE.KEY_SUCCESSFULLY_TAKEN
            || operationalState === OPSTATE.KEY_UNSUCCESSFULLY_TAKEN
            || operationalState === OPSTATE.KEY_SLIDEOUT
            || operationalState === OPSTATE.API_TIMED_OUT)
            && <>
            <StyledRoomNumber>
               {cardData?.roomAccess.join(', ')}
            </StyledRoomNumber>

            <StyledAdditionalAccess>
               {`Access to: \n ${cardData?.additionalAccess.join(', ')}`}
            </StyledAdditionalAccess>

            <StyledStartDate >
               {`${(cardData && isoParser(cardData.startDateTime))}`}
            </StyledStartDate>
            <StyledEndDate>
               {`${(cardData && isoParser(cardData.endDateTime))}`}
            </StyledEndDate>

            </>}
            </StyledCard>
            </StyledCardBox>
        </ScannerBox>
        <ButtonBox>
          <ScanActionButton
            type="button"
            onClick={scanIdButtonHandler}
            disabled={operationalState !== OPSTATE.DEVICE_KEY_IS_READY}
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
