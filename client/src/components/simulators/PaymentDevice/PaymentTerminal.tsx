import { AppContext, AppContextProvider } from './utils/settingsReducer';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import React from 'react';
import { Loading } from '../../shared/Loading';
import { ReactComponent as SettingsIcon } from '../../../assets/svgs/settings.svg';
import ExpandIcon from '../../shared/Expand';
import useLogOn from '../../../hooks/useLogOn';
import { cardlessSecurityPoint, correctPin, negBalancePin, pinTerminalCredentials, reqBody } from './Config';
import useStopTransaction from '../../../hooks/useStopTransaction';
import { rejectTransaction } from './utils/rejectTransaction';
import { updateTransaction } from './utils/updateTransaction';
import { AcceptTransactionStateType, MessageContentType, PayMethod, PinTerminalStatus } from './types';
import acceptTransaction from './utils/acceptTransaction';
import useGetTransaction from '../../../hooks/useGetTransaction';
import PayProvider from '../../shared/PayProvider';
import ActiveTransaction from './ActiveTransaction/ActiveTransaction';
import styled from 'styled-components';
import { Container, GenericFooter, Header } from '../../shared/DraggableModal/ModalTemplate';
import TimeRibbon from '../../shared/TimeRibbon';
import SelectScheme from './DeviceSettings/AvailableSettings/SelectScheme';
import DeviceSettings from './DeviceSettings/DeviceSettings';
import { Message, MessageContainer } from './Message/Message';
import ts from './Translations/translations';
import TurnOnDevice from '../../shared/TurnOnDevice';

const Content = styled.div`
  padding: 0 10px 50px;
  display: flex;
  flex-direction: column;
  overflow-y: sunset;
`;

const Footer = styled(GenericFooter)`
  position: absolute;
  height: 40px;
  bottom: 0px;
`;

const initialMessage = { mainline: '', subline: undefined, failicon: false, successicon: false }

const PaymentTerminal = () => {
  const { state } = useContext(AppContext);
  const { token, logOn } = useLogOn(pinTerminalCredentials, reqBody, 'payment-terminal');
  const [standByText, setStandByText] = useState<string>('OFF')
  const [terminalState, setTerminalState] = useState(PinTerminalStatus.START_UP);
  const [transactionState, setTransactionState] = useState<AcceptTransactionStateType>({ transactionId: '', amountToPay: 0 });
  const { transactionDetails, getTransaction } = useGetTransaction(token, transactionState.transactionId);
  const { stopTransaction } = useStopTransaction(token, reqBody, transactionState.transactionId);
  const [activePayMethod, setActivePayMethod] = useState(PayMethod.NONE);
  const [pincode, setPincode] = useState('');
  const [pinAttempts, setPinAttempts] = useState(0);
  const [hideSettings, setHideSettings] = useState(true);
  const [hidePayProviders, setHidePayProviders] = useState(true);
  const [init, setInit] = useState(false);
  const [messageContent, setMessageContent] = useState<MessageContentType>(initialMessage);

  const logInButtonHandler = useCallback(async () => {
    if (!init) {
      try {
        await logOn()
          .then((success) => {
            if (success) {
              setStandByText(' • •');  
              setTimeout(() => {setStandByText('ON')}, 500);   
              setInit(true); 
              setTerminalState(PinTerminalStatus.START_UP);
            } else {
              setStandByText('ERROR');  
              setTimeout(() => {
                  setStandByText('OFF');   
              }, 4000); 
              setInit(false);
            } 
          });
      } catch (error) {
        console.error("Error during login:", error);
      }
    } else {
      setInit(false);
      setStandByText('OFF');
      stopTransaction();
      setTerminalState(PinTerminalStatus.OUT_OF_ORDER);
    }
  }, [init, logOn, stopTransaction]);

  // Fetch transaction details at regular intervals (1 second) if the terminalState is not idle, 
  // and put the response in transactionDetails:
  useEffect(() => {
    if (terminalState !== PinTerminalStatus.IDLE && terminalState !== PinTerminalStatus.START_UP) {
      const interval = setInterval(() => {
        getTransaction();
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [terminalState, getTransaction]);
  // check if the transactionDetails.Status is 'STOPPED' and go back to IDLE mode with:
  useEffect(() => {
    if (transactionDetails.status === 'STOPPED') {
      setTerminalState(PinTerminalStatus.STOP_TRANSACTION);
    }
  }, [transactionDetails.status]);

  const handleCorrectionEvent = React.useCallback(() => {
    setPincode('');
  }, [setPincode]);

  useEffect(() => {
    if (pincode.length === 4) {
      setTerminalState(PinTerminalStatus.PIN_CONFIRM);
    }
  }, [pincode]);


  const handlePincodeSetter = React.useCallback((value: string) => {
    if (pincode.length < 4) {
      setPincode(pincode + value);
    }
  }, [setPincode, pincode]);

  const chooseMethodHandler = (method: PayMethod) => { setTerminalState(PinTerminalStatus.ACTIVE_METHOD); setActivePayMethod(method); };

  const handleConfirmEvent = () => {
    if (pincode.length === 4) {
      setPinAttempts(pinAttempts + 1);
      setTerminalState(PinTerminalStatus.CHECK_PIN);
    }
  }

  const settingsButtonHandler = useCallback(() => setHideSettings((prev) => !prev), []);
  const payProviderButtonHandler = useCallback(() => setHidePayProviders((prev) => !prev), []);

  useEffect(() => {

    let waitTime: number | undefined = undefined;
    let intervalId: NodeJS.Timer | null = null;
    let acceptTransactionStatusCode: number | undefined = undefined;
    let updateTransactionStatusCode: number | undefined = undefined;

    switch (terminalState) {
      case PinTerminalStatus.START_UP:
        waitTime = 1000;
        break;
      case PinTerminalStatus.OUT_OF_ORDER:
        setMessageContent({ ...initialMessage, subline: ts('outOfOrder', state.language), failicon: true })
        break;
      case PinTerminalStatus.IDLE:
        setMessageContent({ ...initialMessage, mainline: ts('welcome', state.language) })
        setPinAttempts(0);
        setActivePayMethod(PayMethod.NONE);
        setPincode('');
        waitTime = 1000;
        break;
      case PinTerminalStatus.SERVER_ERROR:
        updateTransactionStatusCode === 409 ?
          setMessageContent({ ...initialMessage, mainline: ts('serverError409', state.language), subline: ts('serverError409', state.language, 1), failicon: true }) :
          // if response status code is not 409, set message with a regular serverError;
          setMessageContent({ ...initialMessage, mainline: ts('serverError', state.language), subline: ts('serverError', state.language, 1), failicon: true });
        waitTime = 4500;
        break;
      case PinTerminalStatus.CHOOSE_METHOD:
        waitTime = 15000;
        break;
      case PinTerminalStatus.ACTIVE_METHOD:
        waitTime = 500;
        break;
      case PinTerminalStatus.PIN_CONFIRM:
        waitTime = 7000;
        break;
      case PinTerminalStatus.STOP_TRANSACTION:
        setMessageContent({ ...initialMessage, subline: ts('stopTransaction', state.language), failicon: true })
        waitTime = 4500;
        break;
      case PinTerminalStatus.PIN_ENTRY:
      case PinTerminalStatus.WRONG_PIN:
        waitTime = 10000;
        break;
      case PinTerminalStatus.CHECK_PIN:
        waitTime = 1500;
        break;
      case PinTerminalStatus.TIMED_OUT:
        setMessageContent({ ...initialMessage, mainline: ts('timedOut', state.language), subline: ts('timedOut', state.language, 1) })
        waitTime = 2000;
        break;
      case PinTerminalStatus.CHECK_AMOUNT:
        setMessageContent({ ...initialMessage, subline: ts('oneMoment', state.language) })
        waitTime = 1000;
        break;
      case PinTerminalStatus.PIN_ERROR:
        rejectTransaction(token, transactionState.transactionId, 'FAIL')
        setMessageContent({ ...initialMessage, subline: ts('pinError', state.language), failicon: true })
        waitTime = 4500;
        break;
      case PinTerminalStatus.AMOUNT_ERROR:
        rejectTransaction(token, transactionState.transactionId, 'DECLINE')
        setMessageContent({ ...initialMessage, subline: ts('amountError', state.language), failicon: true })
        waitTime = 4500;
        break;
      case PinTerminalStatus.UPDATE_TRANSACTION:
        setMessageContent({ ...initialMessage, subline: ts('oneMoment', state.language) })
        waitTime = 500;
        break;
      case PinTerminalStatus.SUCCESS:
        setMessageContent({ ...initialMessage, subline: ts('paymentAccepted', state.language), successicon: true })
        waitTime = 3500;
        break;
      case PinTerminalStatus.STOPPED:
        setTerminalState(PinTerminalStatus.OUT_OF_ORDER);
        break;
    }
    if (intervalId) {
      clearInterval(intervalId);
    }
    // when in the designated state, execute ↓ this ↓ AFTER the spicified waittime
    if (waitTime) {
      intervalId = setInterval(async () => {
        switch (terminalState) {
          case PinTerminalStatus.START_UP:
            init === false ? setTerminalState(PinTerminalStatus.OUT_OF_ORDER) : setTerminalState(PinTerminalStatus.IDLE)
            break;
          case PinTerminalStatus.IDLE:
            acceptTransactionStatusCode = await acceptTransaction(token, setTransactionState);
            (acceptTransactionStatusCode === 200) ? setTerminalState(PinTerminalStatus.CHOOSE_METHOD) : null;
            break;
          case PinTerminalStatus.CHOOSE_METHOD:
            setTerminalState(PinTerminalStatus.TIMED_OUT);
            break;
          case PinTerminalStatus.ACTIVE_METHOD:
            if ((activePayMethod === PayMethod.CONTACTLESS && transactionState.amountToPay <= cardlessSecurityPoint) || activePayMethod === PayMethod.SMARTPHONE) {
              setTerminalState(PinTerminalStatus.CHECK_AMOUNT);
            } else {
              setTerminalState(PinTerminalStatus.PIN_ENTRY);
            }
            break;
          case PinTerminalStatus.STOP_TRANSACTION:
            stopTransaction();
            setTerminalState(PinTerminalStatus.IDLE);  // hier ook misschien nog samenvoegen.
            break;
          case PinTerminalStatus.SERVER_ERROR:
            stopTransaction();
            setTerminalState(PinTerminalStatus.IDLE);
            break;
          case PinTerminalStatus.PIN_CONFIRM:
            setTerminalState(PinTerminalStatus.TIMED_OUT);
            break;
          case PinTerminalStatus.PIN_ENTRY:
            setTerminalState(PinTerminalStatus.TIMED_OUT);
            break;
          case PinTerminalStatus.TIMED_OUT:
            stopTransaction();
            setTerminalState(PinTerminalStatus.IDLE);
            break;
          case PinTerminalStatus.WRONG_PIN:
            setTerminalState(PinTerminalStatus.TIMED_OUT);
            break;
          case PinTerminalStatus.CHECK_PIN:
            if ((pincode !== correctPin && pincode !== negBalancePin) && pinAttempts === 3) {
              // Too many attempts
              setTerminalState(PinTerminalStatus.PIN_ERROR);
            } else if (pincode !== correctPin && pincode !== negBalancePin) {
              // Try again (counter is located in the handleConfirmButton)
              setPincode('');
              setTerminalState(PinTerminalStatus.WRONG_PIN);
            } else {
              setTerminalState(PinTerminalStatus.CHECK_AMOUNT);
            }
            break;
          case PinTerminalStatus.CHECK_AMOUNT:
            // You do not have enough money!
            if (pincode === negBalancePin) {
              setTerminalState(PinTerminalStatus.AMOUNT_ERROR);
            } else {
              // other conditions.. so if pin is correct but also when payMethod = contactless
              setTerminalState(PinTerminalStatus.UPDATE_TRANSACTION);
            }
            break;
          case PinTerminalStatus.UPDATE_TRANSACTION:
            updateTransactionStatusCode = await updateTransaction(token, transactionState.transactionId, transactionState.amountToPay, setTerminalState);
            (updateTransactionStatusCode === 200) ? setTerminalState(PinTerminalStatus.SUCCESS) : setTerminalState(PinTerminalStatus.SERVER_ERROR);
            break;
          case PinTerminalStatus.PIN_ERROR || PinTerminalStatus.AMOUNT_ERROR:
            setTerminalState(PinTerminalStatus.IDLE);
            break;
          case PinTerminalStatus.AMOUNT_ERROR:
            setTerminalState(PinTerminalStatus.IDLE);
            break;
          case PinTerminalStatus.SUCCESS:
            setTerminalState(PinTerminalStatus.IDLE);
            break;
        }
      }, waitTime);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activePayMethod, pincode, init, pinAttempts, setMessageContent, state.language, stopTransaction, terminalState, token, transactionState.amountToPay, transactionState.transactionId]);

  const showMessage = useMemo(() => {
    if (terminalState === PinTerminalStatus.OUT_OF_ORDER ||
      terminalState === PinTerminalStatus.IDLE ||
      terminalState === PinTerminalStatus.SERVER_ERROR ||
      terminalState === PinTerminalStatus.STOP_TRANSACTION ||
      terminalState === PinTerminalStatus.TIMED_OUT ||
      terminalState === PinTerminalStatus.CHECK_AMOUNT ||
      terminalState === PinTerminalStatus.PIN_ERROR ||
      terminalState === PinTerminalStatus.AMOUNT_ERROR ||
      terminalState === PinTerminalStatus.UPDATE_TRANSACTION ||
      terminalState === PinTerminalStatus.SUCCESS) {
      return true;
    } else {
      return false;
    }
  }, [terminalState]);

  return (
  
      <AppContextProvider>
      <DeviceSettings hide={hideSettings} onHide={settingsButtonHandler} />
      <SelectScheme hide={hidePayProviders} onHide={payProviderButtonHandler} />
      <Container>
        <TurnOnDevice init={init} logInButtonHandler={logInButtonHandler} standByText={standByText} />
        <Header>Payment Terminal</Header>
        <TimeRibbon />
        <Content>

          {/* {Show loading dots by start-up} */}
          {terminalState === PinTerminalStatus.START_UP && <MessageContainer><Loading /></MessageContainer>}


          {/* {Show window without numpad OR numpad} */}
          {
            showMessage ?
              <Message content={messageContent} terminalState={terminalState}/> :
              <ActiveTransaction
                chooseMethodHandler={chooseMethodHandler}
                activePayMethod={activePayMethod}
                handlePincodeSetter={handlePincodeSetter}
                handleCorrectionEvent={handleCorrectionEvent}
                handleStopEvent={stopTransaction}
                handleConfirmEvent={handleConfirmEvent}
                currentState={terminalState}
                pincode={pincode}
                amount={transactionState.amountToPay}
                init={init} />
          }
        </Content>
        <Footer>

            <div><SettingsIcon width={13} height={13} onClick={settingsButtonHandler} /></div>
          <div onClick={payProviderButtonHandler}>
            <PayProvider width={30} height={22} border={true} provider={state.schemeInUse} />
            <ExpandIcon width={12} height={8} />
          </div>
        </Footer>
      </Container>
      </AppContextProvider>
  );
};

export default PaymentTerminal;

