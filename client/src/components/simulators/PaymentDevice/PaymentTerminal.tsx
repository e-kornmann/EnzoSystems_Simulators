import { AppContext } from './utils/settingsReducer';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import React from 'react';
import { Loading } from '../../shared/Loading';
import { ReactComponent as SettingsIcon } from '../../../assets/svgs/settings.svg';
import ExpandIcon from '../../shared/Expand';
import useLogOn from '../../../hooks/useLogOn';
import { cardlessSecurityPoint, correctPin, negBalancePin, pinTerminalCredentials, reqBody } from './Config';
import useStopTransactionTerminal from './utils/useStopTransactionTerminal';
import { rejectTransaction } from './utils/rejectTransaction';
import { updateTransaction } from './utils/updateTransaction';
import { AcceptTransactionStateType, MessageContentType, PayMethod, Status } from './types/types';
import acceptTransaction from './utils/acceptTransaction';
import useGetTransaction from '../../../hooks/useGetTransaction';
import PayProvider from '../../shared/PayProvider';
import ActiveTransaction from './ActiveTransaction';
import styled from 'styled-components';
import { Container, Content, Header } from '../../shared/DraggableModal/ModalTemplate';
import TimeRibbon from '../../shared/TimeRibbon';
import SelectScheme from './DeviceSettings/AvailableSettings/SelectScheme';
import DeviceSettings from './DeviceSettings/DeviceSettings';
import { Message, MessageContainer } from './Message/Message';
import ts from './Translations/translations';


const PayOptions = styled.div`
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3px;
`;

const Footer = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0px;
  display: flex;
  justify-content: space-between;
  padding: 5px 10px 10px;
  background-color: white;
  border-radius: 0 0 5px 5px;
`;

const SettingsButton = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  margin-top: 4px;
  & > svg {
    height: 13px;
    width: 13px;
  }
  `;

const initialMessage = {mainline: '', subline: undefined, failicon: false, successicon: false}

const PaymentTerminal = () => {
  const { state } = useContext(AppContext);
  const { token, logOn } = useLogOn(pinTerminalCredentials, reqBody);
  const [terminalState, setTerminalState] = useState(Status.START_UP);
  const [transactionState, setTransactionState] = useState<AcceptTransactionStateType>({ transactionId: '', amountToPay: 0 });
  const { transactionDetails, getTransaction } = useGetTransaction(token, transactionState.transactionId);
  const { stopTransaction } = useStopTransactionTerminal(token, transactionState.transactionId);
  const [activePayMethod, setActivePayMethod] = useState(PayMethod.NONE);
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [hideSettings, setHideSettings] = useState(true);
  const [hidePayProviders, setHidePayProviders] = useState(true);
  const [init, setInit] = useState(false);
  const [messageContent, setMessageContent] = useState<MessageContentType>(initialMessage);
  
  useEffect(() => {
    if (init === false) {
       const doLogOn = async () => {
        const logOnSucceeded = await logOn();
        setInit(logOnSucceeded);
      };
      doLogOn();
    }
  }, [init, logOn]);

  // Fetch transaction details at regular intervals (1 second) if the terminalState is not idle, 
  // and put the response in transactionDetails:
  useEffect(() => {
    if (terminalState !== Status.IDLE && terminalState !== Status.START_UP) {
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
      setTerminalState(Status.STOP_TRANSACTION);
    }
  }, [transactionDetails.status]);

  // handle numpads and correct-button clicks
  const handleButtonClick = React.useCallback((value: string) => {
    if (value === 'correct-button') { 
      setPinDigits(["", "", "", ""]);
    } else {
      const updatedPinDigits = [...pinDigits];
      const currentIndex = updatedPinDigits.findIndex((digit) => digit === "");
      updatedPinDigits[currentIndex] = value;
      setPinDigits(updatedPinDigits);
    }
  }, [setPinDigits, pinDigits]);

  const currentPin = useMemo(() => {
    return pinDigits.join("");
  }, [pinDigits]);

  const chooseMethodHandler = (method: PayMethod) => { setTerminalState(Status.ACTIVE_METHOD); setActivePayMethod(method); };

  const payHandler = () => { 
    if (currentPin.length === 4) {
    setPinAttempts(pinAttempts+1); 
    setTerminalState(Status.CHECK_PIN);
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
      case Status.START_UP:
        waitTime = 1000;
        break;
      case Status.OUT_OF_ORDER:
        setMessageContent({...initialMessage, subline: ts('outOfOrder', state.language), failicon: true})
        break;
      case Status.IDLE:
        setMessageContent({...initialMessage, mainline: ts('welcome', state.language)})
        setPinAttempts(0);
        setActivePayMethod(PayMethod.NONE);
        setPinDigits(['','','','']);
        waitTime= 1000;
        break;
      case Status.SERVER_ERROR:
        updateTransactionStatusCode === 409 ? 
          setMessageContent({...initialMessage, mainline: ts('serverError409', state.language), subline: ts('serverError409', state.language, 1), failicon: true}) :
          setMessageContent({...initialMessage, mainline: ts('serverError', state.language), subline: ts('serverError', state.language, 1), failicon: true});
        waitTime = 4500;
        break;
      case Status.CHOOSE_METHOD:
        waitTime = 15000;  
        break;
      case Status.ACTIVE_METHOD:
        waitTime = 500;  
        break;
      case Status.WAITING:
        waitTime = 7000;  
        break;
      case Status.STOP_TRANSACTION:
        setMessageContent({...initialMessage, subline: ts('stopTransaction', state.language), failicon: true})
        waitTime = 4500;
        break;
      case Status.PIN_ENTRY:
      case Status.WRONG_PIN:
        waitTime = 10000;
        break;
     case Status.CHECK_PIN:
        waitTime = 1500;
        break;
      case Status.TIMED_OUT:
        setMessageContent({...initialMessage, mainline: ts('timedOut', state.language), subline: ts('timedOut', state.language, 1)})
        waitTime = 2000;
        break;
      case Status.CHECK_AMOUNT:
        setMessageContent({...initialMessage, subline: ts('oneMoment', state.language)})
        waitTime = 1000;
        break;
      case Status.PIN_ERROR:
        rejectTransaction(token, transactionState.transactionId, 'FAIL') 
        setMessageContent({...initialMessage, subline: ts('pinError', state.language), failicon: true})
        waitTime = 4500;
        break;
      case Status.AMOUNT_ERROR:
        rejectTransaction(token, transactionState.transactionId, 'DECLINE') 
        setMessageContent({...initialMessage, subline: ts('amountError', state.language), failicon: true})
        waitTime = 4500;
        break;
      case Status.UPDATE_TRANSACTION:
        setMessageContent({...initialMessage, subline: ts('oneMoment', state.language)})
        waitTime = 500;
        break;
      case Status.SUCCESS:
        setMessageContent({...initialMessage, subline: ts('paymentAccepted', state.language), successicon: true})
        waitTime = 3500;
        break;
      case Status.STOPPED:
        setTerminalState(Status.OUT_OF_ORDER);
        break;
    }
    if (intervalId) {
      clearInterval(intervalId);
    }
    // when in the designated state, execute ↓ this ↓ AFTER the spicified waittime
    if (waitTime) {
      intervalId = setInterval(async () => {
        switch (terminalState) {
          case Status.START_UP:
            init === false ? setTerminalState(Status.OUT_OF_ORDER) : setTerminalState(Status.IDLE)
            break;
          case Status.IDLE:
            acceptTransactionStatusCode = await acceptTransaction(token, setTransactionState);
            (acceptTransactionStatusCode === 200) ? setTerminalState(Status.CHOOSE_METHOD) : null;
            break;
          case Status.CHOOSE_METHOD:
            setTerminalState(Status.TIMED_OUT);
            break;
          case Status.ACTIVE_METHOD:
            if ((activePayMethod === PayMethod.CONTACTLESS && transactionState.amountToPay <= cardlessSecurityPoint) || activePayMethod === PayMethod.SMARTPHONE ) {
              setTerminalState(Status.CHECK_AMOUNT);
            } else {
              setTerminalState(Status.PIN_ENTRY);
            }
            break;
          case Status.STOP_TRANSACTION:
            stopTransaction();
            setTerminalState(Status.IDLE);  // hier ook misschien nog samenvoegen.
            break;
          case Status.SERVER_ERROR:
            stopTransaction();
            setTerminalState(Status.IDLE);
            break;  
          case Status.WAITING:
            setTerminalState(Status.TIMED_OUT);
            break;
          case Status.PIN_ENTRY:
            setTerminalState(Status.TIMED_OUT);
            break;
          case Status.TIMED_OUT:
            stopTransaction();
            setTerminalState(Status.IDLE);
            break;
          case Status.WRONG_PIN:
            setTerminalState(Status.TIMED_OUT);
            break;
            case Status.CHECK_PIN:
              if ((currentPin !== correctPin && currentPin !== negBalancePin) && pinAttempts === 3) {
                // Too many attempts
                setTerminalState(Status.PIN_ERROR);
              } else if (currentPin !== correctPin && currentPin !== negBalancePin) {
                // Try again (counter is located in the payHandler)
                setPinDigits(['', '', '', '']);
                setTerminalState(Status.WRONG_PIN);
              } else {
                setTerminalState(Status.CHECK_AMOUNT);
              }
              break;
            case Status.CHECK_AMOUNT:
                // You do not have enough money!
                if (currentPin === negBalancePin) {
                  setTerminalState(Status.AMOUNT_ERROR);
              } else {
                // other conditions.. so if pin is correct but also when payMethod = contactless
                setTerminalState(Status.UPDATE_TRANSACTION);                
              }
              break;
            case Status.UPDATE_TRANSACTION:
              updateTransactionStatusCode = await updateTransaction(token, transactionState.transactionId, transactionState.amountToPay, setTerminalState);
              (updateTransactionStatusCode === 200) ? setTerminalState(Status.SUCCESS) : setTerminalState(Status.SERVER_ERROR);
              break;
            case Status.PIN_ERROR || Status.AMOUNT_ERROR :
              setTerminalState(Status.IDLE);
              break;
            case Status.AMOUNT_ERROR :
              setTerminalState(Status.IDLE);
              break;
            case Status.SUCCESS:
              setTerminalState(Status.IDLE);
              break;
        }
      }, waitTime);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activePayMethod, currentPin, init, pinAttempts, setMessageContent, state.language, stopTransaction, terminalState, token, transactionState.amountToPay, transactionState.transactionId]);

  const logTerminalTokenAndTransactionState = React.useCallback(() => {
    console.log(token);
    console.log(transactionState);
  }, [token, transactionState]); 

  const showMessage = useMemo(() => {
    if (terminalState === Status.OUT_OF_ORDER ||
      terminalState === Status.IDLE ||
      terminalState === Status.SERVER_ERROR ||
      terminalState === Status.STOP_TRANSACTION ||
      terminalState === Status.TIMED_OUT ||
      terminalState === Status.CHECK_AMOUNT ||
      terminalState === Status.PIN_ERROR ||
      terminalState === Status.AMOUNT_ERROR ||
      terminalState === Status.UPDATE_TRANSACTION ||
      terminalState === Status.SUCCESS) {
      return true;
    } else {
      return false;
    }
  }, [terminalState]);

  return (
    <>
      <DeviceSettings hide={hideSettings} onHide={settingsButtonHandler} />
      <SelectScheme hide={hidePayProviders} onHide={payProviderButtonHandler} />
      <Container>
        <Header onClick={logTerminalTokenAndTransactionState}>Payment Terminal</Header>
        <TimeRibbon />
        <Content>

            {/* {Show loading dots} */}
         { terminalState === Status.START_UP && <MessageContainer><Loading /></MessageContainer> }


             {/* {Show window without numpad OR numpad} */}
          {
            showMessage ? 
          <Message content={messageContent} /> : 
            
        <ActiveTransaction
          chooseMethodHandler={chooseMethodHandler}
          activePayMethod={activePayMethod}
          handleButtonClick={handleButtonClick}
          stopHandler={stopTransaction}
          payHandler={payHandler}
          currentState={terminalState}
          pinDigits={pinDigits}
          amount={transactionState.amountToPay} />
        }

        </Content>
        <Footer>
          <SettingsButton>
          <SettingsIcon
            onClick={settingsButtonHandler}
          /></SettingsButton>
          <PayOptions onClick={payProviderButtonHandler}>
             <PayProvider width={30} height={22} border={true} provider={state.selectedScheme}/>
            <ExpandIcon width={12} height={8} />
          </PayOptions>
        </Footer>
      </Container>
    </>
  );
};

export default PaymentTerminal;        

