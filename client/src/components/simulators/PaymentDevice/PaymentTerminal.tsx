import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as SettingsIcon } from '../../../assets/svgs/settings.svg';
import ExpandIcon from '../../shared/Expand';
import useLogOn from '../../../hooks/useLogOn';
import { axiosUrl, cardlessSecurityPoint, correctPin, negBalancePin, pinTerminalCredentials, reqBody } from './Config';
// import updateTransaction from './utils/updateTransaction';
import { MessageContentType, PayMethod, OPSTATE } from './types';
import { changeDeviceStatus, getSession, stopTransaction, updateTransaction } from './utils/acceptTransaction';
import PayProvider from '../../shared/PayProvider';
import ActiveTransaction from './ActiveTransaction/ActiveTransaction';
import * as S from '../../shared/DraggableModal/ModalTemplate';
import TimeRibbon from '../../shared/TimeRibbon';
import SelectScheme from './DeviceSettings/AvailableSettings/SelectScheme';
import { Message, MessageContainer } from './Message/Message';
import ts from './Translations/translations';
import { AppContext } from './utils/settingsReducer';
import { SharedLoading } from '../../shared/Loading';
import { DeviceSettings } from './DeviceSettings/DeviceSettings';
import ShowIcon from '../../../types/ShowIcon';
import DEVICESTATUSOPTIONS from './enums/DeviceStatusOptions';

const Content = styled.div`
  padding: 0 10px 50px;
  display: flex;
  flex-direction: column;
  overflow-y: sunset;
`;

const StyledHeader = styled(S.SharedStyledHeader)({
  justifyContent: 'center',
});

const StyledFooter = styled(S.SharedStyledFooter)`
  position: absolute;
  height: 40px;
  bottom: 0px;
`;

const initialMessage = {
  mainline: '',
  subline: undefined,
  checkOrCrossIcon: undefined,
};

const PaymentTerminalComponent = () => {
  const { state } = useContext(AppContext);
  const { token, logOn } = useLogOn(pinTerminalCredentials, reqBody, axiosUrl);
  const [init, setInit] = useState(false);
  const [nextPoll, setNextPoll] = useState(false);
  const initialSessionRequest = useRef(true);
  const [operationalState, setOperationalState] = useState(OPSTATE.DEVICE_START_UP);
  const [amountToPay, setAmountToPay] = useState(0);
  const [activePayMethod, setActivePayMethod] = useState(PayMethod.NONE);
  const [pincode, setPincode] = useState('');
  const [pinAttempts, setPinAttempts] = useState(0);
  const [hideSettings, setHideSettings] = useState(true);
  const [hidePayProviders, setHidePayProviders] = useState(true);
  const [messageContent, setMessageContent] = useState<MessageContentType>(initialMessage);
  const [deviceState, setDeviceState] = useState(DEVICESTATUSOPTIONS.CONNECTED);

  useEffect(() => {
    if (init === false) {
      const doLogOn = async () => {
        const logOnSucceeded = await logOn();
        setInit(logOnSucceeded);
      };
      doLogOn();
    }
  }, [init, logOn]);

  const handleCorrectionEvent = useCallback(() => {
    setPincode('');
  }, [setPincode]);

  useEffect(() => {
    if (pincode.length === 4) {
      setOperationalState(OPSTATE.PIN_CONFIRM);
    }
  }, [pincode]);

  const handlePincodeSetter = useCallback((value: string) => {
    if (pincode.length < 4) {
      setPincode(pincode + value);
    }
  }, [setPincode, pincode]);

  const chooseMethodHandler = (method: PayMethod) => {
    setOperationalState(OPSTATE.ACTIVE_METHOD);
    setActivePayMethod(method);
  };

  const stopTransactionHandler = useCallback(() => {
    setOperationalState(OPSTATE.STOP_TRANSACTION);
  }, []);

  const handleConfirmEvent = () => {
    if (pincode.length === 4) {
      setPinAttempts(pinAttempts + 1);
      setOperationalState(OPSTATE.CHECK_PIN);
    }
  };

  const settingsButtonHandler = useCallback(() => setHideSettings(prev => !prev), []);
  const payProviderButtonHandler = useCallback(() => setHidePayProviders(prev => !prev), []);

  const getPaymentSession = useCallback(async () => {
    if (token) {
      const res = await getSession(token);
      if (!res) {
        setOperationalState(OPSTATE.SERVER_ERROR);
        setNextPoll(false);
        initialSessionRequest.current = true;
      } else {
        // only do next poll if status is IDLE or CHOOSE_METHOD otherwhise you will get conflicts.
        if (operationalState === OPSTATE.DEVICE_IDLE) {
          if (res.metadata?.command === 'PAYMENT' && res.metadata?.status === 'ACTIVE') {
            setNextPoll(false);
            initialSessionRequest.current = true;
            setAmountToPay(res.transactionData.amount);
            setOperationalState(OPSTATE.CHOOSE_METHOD);
          } else {
            console.log(res);
            setNextPoll(true);
          }
        }
        if (operationalState === OPSTATE.CHOOSE_METHOD) {
          // but don't do a next poll when these situations occur.
          if (res.result === 'NO_ACTIVE_SESSION') {
            // this one can be deleted when timed_out works
            setNextPoll(false);
            console.log('DEVICE TIMED OUT');
            initialSessionRequest.current = true;
            setOperationalState(OPSTATE.API_TIMED_OUT);
          } else if (res.metadata?.status === 'TIMED_OUT') {
            setNextPoll(false);
            initialSessionRequest.current = true;
            setOperationalState(OPSTATE.API_TIMED_OUT);
          } else if (res.metadata?.status === 'CANCELLING') {
            setNextPoll(false);
            initialSessionRequest.current = true;
            setOperationalState(OPSTATE.API_CANCEL);
            // no timeout? en no cancelling? get another session.
          } else {
            console.log(res);
            setNextPoll(true);
          }
        }
      }
    }
  }, [operationalState, token]);

  const changeStatus = useCallback(async (changeToThisState: DEVICESTATUSOPTIONS) => {
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
      } else if (changeToThisState === DEVICESTATUSOPTIONS.CONNECTED) {
        setOperationalState(OPSTATE.DEVICE_COULD_NOT_CONNECT);
      } else if (changeToThisState === DEVICESTATUSOPTIONS.DISCONNECTED) {
        setOperationalState(OPSTATE.DEVICE_COULD_NOT_DISCONNECT);
      }
    }
  }, [token]);

  useEffect(() => {
    let waitTime: number | undefined;
    let intervalId: NodeJS.Timer | null = null;
    let updateTransactionStatusCode: number | undefined;

    switch (operationalState) {
      case OPSTATE.DEVICE_START_UP:
        setMessageContent(initialMessage);
        waitTime = 1500;
        break;
      case OPSTATE.DEVICE_CONNECT:
        setNextPoll(false);
        initialSessionRequest.current = true;
        setMessageContent(initialMessage);
        changeStatus(DEVICESTATUSOPTIONS.CONNECTED);
        // if setting isn't already connected, then set it.
        if (deviceState !== DEVICESTATUSOPTIONS.CONNECTED) {
          setDeviceState(DEVICESTATUSOPTIONS.CONNECTED);
        }
        break;
      case OPSTATE.DEVICE_IDLE:
        setMessageContent({ ...initialMessage, mainline: ts('welcome', state.language) });
        setPinAttempts(0);
        setActivePayMethod(PayMethod.NONE);
        setPincode('');
        waitTime = 25000;
        // when in this state getSession is initiated
        break;
      case OPSTATE.DEVICE_COULD_NOT_CONNECT:
        setMessageContent({ ...initialMessage, mainline: ts('couldNotConnect', state.language) });
        waitTime = 3500;
        break;
      // case OPSTATE.DEVICE_DISCONNECT:
      //   setMessageContent({ ...initialMessage, subline: ts('Disconnecting...', state.language) });
      //   waitTime = 1000;
      //   break;
      // case OPSTATE.DEVICE_DISCONNECTED:
      //   setMessageContent({ ...initialMessage, subline: ts('DISCONNECTED', state.language) });
      //   if (settingState[APPSETTINGS.DEVICE_STATUS] !== DEVICESTATUSOPTIONS.DISCONNECTED) {
      //     settingDispatch({ type: APPSETTINGS.DEVICE_STATUS, payload: DEVICESTATUSOPTIONS.DISCONNECTED });
      //   }
      //   break;
      // case OPSTATE.DEVICE_COULD_NOT_DISCONNECT:
      //   setMessageContent({ ...initialMessage, mainline: ts('couldNotDisconnect', state.language) });
      //   waitTime = 3500;
      //   break;
      case OPSTATE.CHOOSE_METHOD:
        waitTime = 12000;
        break;
      case OPSTATE.ACTIVE_METHOD:
        waitTime = 500;
        break;
      case OPSTATE.PIN_CONFIRM:
        waitTime = 7000;
        break;
      case OPSTATE.STOP_TRANSACTION:
        setMessageContent({
          ...initialMessage,
          subline: ts('stopTransaction', state.language),
          checkOrCrossIcon: ShowIcon.CROSS,
        });
        waitTime = 4500;
        break;
      case OPSTATE.PIN_ENTRY:
      case OPSTATE.WRONG_PIN:
        waitTime = 10000;
        break;
      case OPSTATE.CHECK_PIN:
        waitTime = 1500;
        break;
      case OPSTATE.API_TIMED_OUT:
        setMessageContent({ ...initialMessage, mainline: ts('timedOut', state.language), subline: ts('timedOut', state.language, 1) });
        waitTime = 2000;
        break;
      case OPSTATE.CHECK_AMOUNT:
        setMessageContent({ ...initialMessage, subline: ts('oneMoment', state.language) });
        waitTime = 1000;
        break;
      case OPSTATE.PIN_ERROR:
        if (token) {
          stopTransaction(token, 'DECLINED');
          setMessageContent({ ...initialMessage, subline: ts('pinError', state.language), checkOrCrossIcon: ShowIcon.CROSS });
        }
        waitTime = 4500;
        break;
      case OPSTATE.AMOUNT_ERROR:
        if (token) {
          stopTransaction(token, 'DECLINED');
          setMessageContent({ ...initialMessage, subline: ts('amountError', state.language), checkOrCrossIcon: ShowIcon.CROSS });
        }
        waitTime = 4500;
        break;
      case OPSTATE.UPDATE_TRANSACTION:
        setMessageContent({ ...initialMessage, subline: ts('oneMoment', state.language) });
        waitTime = 500;
        break;
      case OPSTATE.SUCCESS:
        setMessageContent({ ...initialMessage, subline: ts('paymentAccepted', state.language), checkOrCrossIcon: ShowIcon.CHECK });
        waitTime = 3500;
        break;
      case OPSTATE.STOPPED:
        setOperationalState(OPSTATE.DEVICE_OUT_OF_ORDER);
        break;
      case OPSTATE.SERVER_ERROR:
        if (updateTransactionStatusCode === 409) {
          setMessageContent({
            ...initialMessage,
            mainline: ts('serverError409', state.language),
            subline: ts('serverError409', state.language, 1),
            checkOrCrossIcon: ShowIcon.CROSS,
          });
        } else { // if response status code is not 409, set message with a regular serverError;
          setMessageContent({
            ...initialMessage,
            mainline: ts('serverError', state.language),
            subline: ts('serverError', state.language, 1),
            checkOrCrossIcon: ShowIcon.CROSS,
          });
        }
        waitTime = 4500;
        break;
      case OPSTATE.DEVICE_OUT_OF_ORDER:
        setMessageContent({ ...initialMessage, subline: ts('outOfOrder', state.language), checkOrCrossIcon: ShowIcon.CROSS });
        break;
      default:
        setOperationalState(OPSTATE.UNKNOWN);
        break;
    }
    // when in the designated state, execute ↓ this ↓ AFTER the spicified waittime
    if (waitTime) {
      intervalId = setInterval(async () => {
        switch (operationalState) {
          case OPSTATE.DEVICE_START_UP:
            if (init === false) {
              setOperationalState(OPSTATE.SERVER_ERROR);
            } else {
              setOperationalState(OPSTATE.DEVICE_CONNECT);
            }
            // if (!token) getToken();
            // else setOperationalState(OPSTATE.DEVICE_IDLE);
            break;
          case OPSTATE.DEVICE_IDLE:
            // connect again to avoid server TIMEOUT
            setOperationalState(OPSTATE.DEVICE_CONNECT);
            break;
          // case OPSTATE.DEVICE_DISCONNECT:
          //   changeStatus(DEVICESTATUSOPTIONS.DISCONNECTED);
          //   break;
          case OPSTATE.DEVICE_COULD_NOT_CONNECT:
          // case OPSTATE.DEVICE_COULD_NOT_DISCONNECT:
            setOperationalState(OPSTATE.SERVER_ERROR);
            break;
          case OPSTATE.ACTIVE_METHOD:
            if ((activePayMethod === PayMethod.CONTACTLESS && amountToPay <= cardlessSecurityPoint)
             || activePayMethod === PayMethod.SMARTPHONE) {
              setOperationalState(OPSTATE.CHECK_AMOUNT);
            } else {
              setOperationalState(OPSTATE.PIN_ENTRY);
            }
            break;
          case OPSTATE.PIN_CONFIRM:
          case OPSTATE.PIN_ENTRY:
          case OPSTATE.CHOOSE_METHOD:
          case OPSTATE.WRONG_PIN:
            setOperationalState(OPSTATE.API_TIMED_OUT);
            break;
          case OPSTATE.API_TIMED_OUT:
          case OPSTATE.STOP_TRANSACTION:
          case OPSTATE.SERVER_ERROR:
            if (token) stopTransaction(token, 'STOPPED');
            setOperationalState(OPSTATE.DEVICE_CONNECT);
            break;
          case OPSTATE.CHECK_PIN:
            if ((pincode !== correctPin && pincode !== negBalancePin) && pinAttempts === 3) {
              // Too many attempts
              setOperationalState(OPSTATE.PIN_ERROR);
            } else if (pincode !== correctPin && pincode !== negBalancePin) {
              // Try again (counter is located in the handleConfirmButton)
              setPincode('');
              setOperationalState(OPSTATE.WRONG_PIN);
            } else {
              setOperationalState(OPSTATE.CHECK_AMOUNT);
            }
            break;
          case OPSTATE.CHECK_AMOUNT:
            // You do not have enough money!
            if (pincode === negBalancePin) {
              setOperationalState(OPSTATE.AMOUNT_ERROR);
            } else {
              // other conditions.. so if pin is correct but also when payMethod = contactless
              setOperationalState(OPSTATE.UPDATE_TRANSACTION);
            }
            break;
          case OPSTATE.UPDATE_TRANSACTION:
            if (token && amountToPay) {
              const res = await updateTransaction(token, amountToPay, state.schemeInUse);
              console.log(res);
              if (res) {
                if (res.status === 'FINISHED') {
                  setOperationalState(OPSTATE.SUCCESS);
                } else {
                  console.log(res);
                  setOperationalState(OPSTATE.SERVER_ERROR);
                }
              }
            }
            break;
          case OPSTATE.PIN_ERROR:
          case OPSTATE.AMOUNT_ERROR:
          case OPSTATE.SUCCESS:
            setOperationalState(OPSTATE.DEVICE_CONNECT);
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
  }, [activePayMethod,
    amountToPay,
    changeStatus,
    deviceState,
    init,
    operationalState,
    pinAttempts,
    pincode,
    state.language,
    state.schemeInUse,
    token]);

  const showMessage = useMemo(() => {
    if (operationalState === OPSTATE.DEVICE_OUT_OF_ORDER
      || operationalState === OPSTATE.DEVICE_IDLE
      || operationalState === OPSTATE.SERVER_ERROR
      || operationalState === OPSTATE.STOP_TRANSACTION
      || operationalState === OPSTATE.API_TIMED_OUT
      || operationalState === OPSTATE.CHECK_AMOUNT
      || operationalState === OPSTATE.PIN_ERROR
      || operationalState === OPSTATE.AMOUNT_ERROR
      || operationalState === OPSTATE.UPDATE_TRANSACTION
      || operationalState === OPSTATE.SUCCESS) {
      return true;
    }
    return false;
  }, [operationalState]);

  /* Repeatedly Get Session Based on operationalState */
  useEffect(() => {
    // while WAITING, send a new "long" poll for a new session (1st request)
    if ((operationalState === OPSTATE.DEVICE_IDLE
          || operationalState === OPSTATE.CHOOSE_METHOD)
          && initialSessionRequest.current) {
      initialSessionRequest.current = false;
      console.log('initiate getPaymentSession');
      if (operationalState === OPSTATE.CHOOSE_METHOD) {
        setTimeout(async () => {
          await getPaymentSession();
        }, 1000);
      } else {
        getPaymentSession();
      }
      // any subsequent request
    } else if ((operationalState === OPSTATE.DEVICE_IDLE
          || operationalState === OPSTATE.CHOOSE_METHOD)
          && nextPoll && !initialSessionRequest.current) {
      console.log('next getPaymentSession');
      setNextPoll(false);
      if (operationalState === OPSTATE.CHOOSE_METHOD) {
        setTimeout(async () => {
          await getPaymentSession();
        }, 1000);
      } else {
        getPaymentSession();
      }
    }
  }, [getPaymentSession, nextPoll, operationalState, token]);

  return (

    <>
      <DeviceSettings hide={hideSettings} onHide={settingsButtonHandler} />
      <SelectScheme hide={hidePayProviders} onHide={payProviderButtonHandler} />
      <S.SharedStyledContainer $isDraggable={true}>
        <StyledHeader>Payment Terminal</StyledHeader>
        <TimeRibbon />
        <Content>

          {/* {Show loading dots by start-up} */}
          {operationalState === OPSTATE.DEVICE_START_UP && <MessageContainer><SharedLoading /></MessageContainer>}

          {/* {Show window without numpad OR numpad} */}
          {
            showMessage
              ? <Message content={messageContent} operationalState={operationalState} />
              : <ActiveTransaction
                chooseMethodHandler={chooseMethodHandler}
                activePayMethod={activePayMethod}
                handlePincodeSetter={handlePincodeSetter}
                handleCorrectionEvent={handleCorrectionEvent}
                handleStopEvent={stopTransactionHandler}
                handleConfirmEvent={handleConfirmEvent}
                currentState={operationalState}
                pincode={pincode}
                amount={amountToPay}
                init={init} />
          }
        </Content>
        <StyledFooter>

          <div><SettingsIcon width={16} height={16} onClick={settingsButtonHandler} /></div>
          <div onClick={payProviderButtonHandler}>
            <PayProvider width={30} height={21} border={true} provider={state.schemeInUse} />
            <ExpandIcon width={12} height={8} />
          </div>
        </StyledFooter>
      </S.SharedStyledContainer>
    </>
  );
};

export const PaymentTerminal = memo(PaymentTerminalComponent);
