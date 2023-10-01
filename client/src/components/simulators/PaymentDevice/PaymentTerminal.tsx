import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { ReactComponent as SettingsIcon } from '../../../assets/svgs/settings.svg';
import ExpandIcon from '../../shared/Expand';
import useLogOn from '../../../hooks/useLogOn';
import { axiosUrl, cardlessSecurityPoint, correctPin, negBalancePin, pinTerminalCredentials, reqBody } from './Config';
import useStopTransaction from '../../../hooks/useStopTransaction';
import rejectTransaction from './utils/rejectTransaction';
import updateTransaction from './utils/updateTransaction';
import { AcceptTransactionStateType, MessageContentType, PayMethod, OPSTATE } from './types';
import acceptTransaction from './utils/acceptTransaction';
import useGetTransaction from '../../../hooks/useGetTransaction';
import PayProvider from '../../shared/PayProvider';
import ActiveTransaction from './ActiveTransaction/ActiveTransaction';
import * as S from '../../shared/DraggableModal/ModalTemplate';
import TimeRibbon from '../../shared/TimeRibbon';
import SelectScheme from './DeviceSettings/AvailableSettings/SelectScheme';
import DeviceSettings from './DeviceSettings/DeviceSettings';
import { Message, MessageContainer } from './Message/Message';
import ts from './Translations/translations';
import { AppContext } from './utils/settingsReducer';
import { SharedLoading } from '../../shared/Loading';
import ShowIcon from '../../../types/ShowIcon';

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

const PaymentTerminal = () => {
  const { state } = useContext(AppContext);
  const { token, logOn } = useLogOn(pinTerminalCredentials, reqBody, axiosUrl);
  const [operationalState, setOperationalState] = useState(OPSTATE.DEVICE_START_UP);
  const [transactionState, setTransactionState] = useState<AcceptTransactionStateType>({ transactionId: '', amountToPay: 0 });
  const { transactionDetails, getTransaction } = useGetTransaction(token, transactionState.transactionId, reqBody, axiosUrl);
  const { stopTransaction } = useStopTransaction(token, transactionState.transactionId, reqBody, axiosUrl);
  const [activePayMethod, setActivePayMethod] = useState(PayMethod.NONE);
  const [pincode, setPincode] = useState('');
  const [pinAttempts, setPinAttempts] = useState(0);
  const [hideSettings, setHideSettings] = useState(true);
  const [hidePayProviders, setHidePayProviders] = useState(true);
  const [messageContent, setMessageContent] = useState<MessageContentType>(initialMessage);

  const getToken = useCallback(async () => {
    await logOn().then(success => (success
      ? setOperationalState(OPSTATE.IDLE)
      : setOperationalState(OPSTATE.SERVER_ERROR)));
  }, [logOn]);

  // Fetch transaction details at regular intervals (1 second) if the operationalState is not idle,
  // and put the response in transactionDetails:
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (operationalState !== OPSTATE.IDLE && operationalState !== OPSTATE.DEVICE_START_UP) {
      const interval = setInterval(() => {
        getTransaction();
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [operationalState, getTransaction]);

  // check if the transactionDetails.Status is 'STOPPED' and go back to IDLE mode with:
  useEffect(() => {
    if (transactionDetails.status === 'STOPPED') {
      setOperationalState(OPSTATE.STOP_TRANSACTION);
    }
  }, [transactionDetails.status]);

  const handleCorrectionEvent = React.useCallback(() => {
    setPincode('');
  }, [setPincode]);

  useEffect(() => {
    if (pincode.length === 4) {
      setOperationalState(OPSTATE.PIN_CONFIRM);
    }
  }, [pincode]);

  const handlePincodeSetter = React.useCallback((value: string) => {
    if (pincode.length < 4) {
      setPincode(pincode + value);
    }
  }, [setPincode, pincode]);

  const chooseMethodHandler = (method: PayMethod) => {
    setOperationalState(OPSTATE.ACTIVE_METHOD);
    setActivePayMethod(method);
  };

  const handleConfirmEvent = () => {
    if (pincode.length === 4) {
      setPinAttempts(pinAttempts + 1);
      setOperationalState(OPSTATE.CHECK_PIN);
    }
  };

  const settingsButtonHandler = useCallback(() => setHideSettings(prev => !prev), []);
  const payProviderButtonHandler = useCallback(() => setHidePayProviders(prev => !prev), []);

  useEffect(() => {
    let waitTime: number | undefined;
    let intervalId: NodeJS.Timer | null = null;
    let acceptTransactionStatusCode: number | undefined;
    let updateTransactionStatusCode: number | undefined;

    switch (operationalState) {
      case OPSTATE.DEVICE_START_UP:
        setMessageContent(initialMessage);
        waitTime = 1500;
        break;
      case OPSTATE.DEVICE_OUT_OF_ORDER:
        setMessageContent({ ...initialMessage, subline: ts('outOfOrder', state.language), checkOrCrossIcon: ShowIcon.CROSS });
        break;
      case OPSTATE.IDLE:
        setMessageContent({ ...initialMessage, mainline: ts('welcome', state.language) });
        setPinAttempts(0);
        setActivePayMethod(PayMethod.NONE);
        setPincode('');
        waitTime = 1000;
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
      case OPSTATE.CHOOSE_METHOD:
        waitTime = 15000;
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
      case OPSTATE.TIMED_OUT:
        setMessageContent({ ...initialMessage, mainline: ts('timedOut', state.language), subline: ts('timedOut', state.language, 1) });
        waitTime = 2000;
        break;
      case OPSTATE.CHECK_AMOUNT:
        setMessageContent({ ...initialMessage, subline: ts('oneMoment', state.language) });
        waitTime = 1000;
        break;
      case OPSTATE.PIN_ERROR:
        if (token) {
          rejectTransaction(token, transactionState.transactionId, 'FAIL');
          setMessageContent({ ...initialMessage, subline: ts('pinError', state.language), checkOrCrossIcon: ShowIcon.CROSS });
        }
        waitTime = 4500;
        break;
      case OPSTATE.AMOUNT_ERROR:
        if (token) {
          rejectTransaction(token, transactionState.transactionId, 'DECLINE');
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
      default:
        break;
    }
    // when in the designated state, execute ↓ this ↓ AFTER the spicified waittime
    if (waitTime) {
      intervalId = setInterval(async () => {
        switch (operationalState) {
          case OPSTATE.DEVICE_START_UP:
            if (!token) getToken();
            else setOperationalState(OPSTATE.IDLE);
            break;
          case OPSTATE.IDLE:
            if (token) {
              acceptTransactionStatusCode = await acceptTransaction(token, setTransactionState);
              if (acceptTransactionStatusCode === 200) setOperationalState(OPSTATE.CHOOSE_METHOD);
            }
            break;
          case OPSTATE.CHOOSE_METHOD:
            setOperationalState(OPSTATE.TIMED_OUT);
            break;
          case OPSTATE.ACTIVE_METHOD:
            if ((activePayMethod === PayMethod.CONTACTLESS && transactionState.amountToPay <= cardlessSecurityPoint)
             || activePayMethod === PayMethod.SMARTPHONE) {
              setOperationalState(OPSTATE.CHECK_AMOUNT);
            } else {
              setOperationalState(OPSTATE.PIN_ENTRY);
            }
            break;
          case OPSTATE.STOP_TRANSACTION:
            stopTransaction();
            setOperationalState(OPSTATE.IDLE); // hier ook misschien nog samenvoegen.
            break;
          case OPSTATE.SERVER_ERROR:
            stopTransaction();
            setOperationalState(OPSTATE.IDLE);
            break;
          case OPSTATE.PIN_CONFIRM:
            setOperationalState(OPSTATE.TIMED_OUT);
            break;
          case OPSTATE.PIN_ENTRY:
            setOperationalState(OPSTATE.TIMED_OUT);
            break;
          case OPSTATE.TIMED_OUT:
            stopTransaction();
            setOperationalState(OPSTATE.IDLE);
            break;
          case OPSTATE.WRONG_PIN:
            setOperationalState(OPSTATE.TIMED_OUT);
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
            if (token) {
              updateTransactionStatusCode = await
              updateTransaction(token, transactionState.transactionId, transactionState.amountToPay, setOperationalState);
              if (updateTransactionStatusCode === 200) setOperationalState(OPSTATE.SUCCESS);
              else setOperationalState(OPSTATE.SERVER_ERROR);
            }
            break;
          case OPSTATE.PIN_ERROR || OPSTATE.AMOUNT_ERROR:
            setOperationalState(OPSTATE.IDLE);
            break;
          case OPSTATE.AMOUNT_ERROR:
            setOperationalState(OPSTATE.IDLE);
            break;
          case OPSTATE.SUCCESS:
            setOperationalState(OPSTATE.IDLE);
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
    getToken,
    operationalState,
    pinAttempts,
    pincode,
    state.language,
    stopTransaction,
    token,
    transactionState.amountToPay,
    transactionState.transactionId]);
// ]
  
//   [activePayMethod,
//     getToken,
//     operationalState,
//     pinAttempts,
//     pincode,
//     state.language,
//     stopTransaction,
//     token,
//     transactionState.amountToPay,
//     transactionState.transactionId]);

  const showMessage = useMemo(() => {
    if (operationalState === OPSTATE.DEVICE_OUT_OF_ORDER
      || operationalState === OPSTATE.IDLE
      || operationalState === OPSTATE.SERVER_ERROR
      || operationalState === OPSTATE.STOP_TRANSACTION
      || operationalState === OPSTATE.TIMED_OUT
      || operationalState === OPSTATE.CHECK_AMOUNT
      || operationalState === OPSTATE.PIN_ERROR
      || operationalState === OPSTATE.AMOUNT_ERROR
      || operationalState === OPSTATE.UPDATE_TRANSACTION
      || operationalState === OPSTATE.SUCCESS) {
      return true;
    }
    return false;
  }, [operationalState]);

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
                handleStopEvent={stopTransaction}
                handleConfirmEvent={handleConfirmEvent}
                currentState={operationalState}
                pincode={pincode}
                amount={transactionState.amountToPay}
                init={token !== undefined } />
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

export default PaymentTerminal;
