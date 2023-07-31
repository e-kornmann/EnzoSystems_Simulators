import * as S from './PaymentTerminal.styles';
import { AppContext } from './utils/settingsReducer';
import { useContext, useEffect, useState } from 'react';
import TimedOut from './displays/TimedOut';
import Welcome from './displays/Welcome';
import OneMoment from './displays/OneMoment';
import Success from './displays/Success';
import Cancel from './displays/Cancel';
import React from 'react';
import { Loading } from './displays/Loading';
import PinError from './displays/PinError';
import { ReactComponent as SettingsIcon } from '../../../assets/svgs/settings.svg';
import ExpandIcon from '../../shared/svgcomponents/Expand';
import { PayOptions, TimeRibbon } from './PaymentTerminal.styles';
import AppSettings from './Personalisation/AppSettings/AppSettings';
import NotConnected from './displays/NotConnected';
import ServerError from './displays/ServerError';
import useLogOn from '../../../hooks/useLogOn';
import { cardlessSecurityPoint, correctPin, negBalancePin, pinTerminalCredentials, reqBody } from './config';
import useStopTransactionTerminal from './utils/useStopTransactionTerminal';
import { rejectTransaction } from './utils/rejectTransaction';
import { updateTransaction } from './utils/updateTransaction';
import { AcceptTransactionStateType, PayMethod, Status } from './types/types';
import acceptTransaction from './utils/acceptTransaction';
import useGetTransaction from '../../../hooks/useGetTransaction';
import SelectScheme from './Personalisation/AppSettings/AvailableSettings/SelectScheme';
import PayProvider from '../../shared/svgcomponents/PayProvider';
import ActiveTransaction from './ActiveTransaction/ActiveTransaction';

const PaymentTerminal = () => {
  const { token, logOn } = useLogOn(pinTerminalCredentials, reqBody);
  const [status, setStatus] = useState(Status.START_UP);
  const [ transactionState, setTransactionState] = useState<AcceptTransactionStateType>({ transactionId: '', amountToPay: 0 });
  const { transactionDetails, getTransaction } = useGetTransaction(token, transactionState.transactionId);
  const { stopTransaction } = useStopTransactionTerminal(token, transactionState.transactionId);
  const [activePayMethod, setActivePayMethod] = useState(PayMethod.NONE)
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [display, setDisplay] = useState(<Welcome />);
  const [hideSettings, setHideSettings] = useState(true);
  const [hidePayProviders, setHidePayProviders] = useState(true);
  const [init, setInit] = useState(false);
  const { state } = useContext(AppContext);

  useEffect(() => {
    if (init === false) {
       const doLogOn = async () => {
        const logOnSucceeded = await logOn();
        setInit(logOnSucceeded);
      };
      doLogOn();
    }
  }, [init, logOn]);

  // Fetch transaction details at regular intervals (1 second) if the status is not idle, and
  // check if the transaction status is 'STOPPED' for the following useEffect below;
  useEffect(() => {
    if (status !== Status.IDLE && status !== Status.START_UP) {
      const interval = setInterval(() => {
      getTransaction();
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [status, getTransaction]);

  useEffect(() => {
    if (transactionDetails.status === 'STOPPED') {
      setStatus(Status.STOP_TRANSACTION);
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

  const currentPin = pinDigits.join("");

  const chooseMethodHandler = (method: PayMethod) => { setStatus(Status.ACTIVE_METHOD); setActivePayMethod(method); };

  const payHandler = () => { 
    if (currentPin.length === 4) {
    setPinAttempts(pinAttempts+1); 
    setStatus(Status.CHECK_PIN);
    } 
  }

  const settingsButtonHandler = () => setHideSettings(!hideSettings);
  const payProviderButtonHandler = () => setHidePayProviders(!hidePayProviders);

  useEffect(() => {
    
    let waitTime: number | undefined = undefined;
    let intervalId: NodeJS.Timer | null = null;
    let acceptTransactionStatusCode: number | undefined = undefined;
    let updateTransactionStatusCode: number | undefined = undefined;

    switch (status) {
      case Status.START_UP:
        setDisplay(<Loading/>);
        waitTime = 1000;
        break;
      case Status.OUT_OF_ORDER:
        setDisplay(<NotConnected/>);
        break;
      case Status.IDLE:
        setDisplay(<Welcome />);
        setPinAttempts(0);
        setActivePayMethod(PayMethod.NONE);
        setPinDigits(['','','','']);
        waitTime= 1000;
        break;
      case Status.SERVER_ERROR:
        setDisplay(<ServerError statusCode={updateTransactionStatusCode}  />);
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
        setDisplay(<Cancel />);
        waitTime = 4500;
        break;
      case Status.PIN_ENTRY:
        waitTime = 10000;
        break;
     case Status.CHECK_PIN:
        setDisplay(<Loading/>);
        waitTime = 1500;
        break;
      case Status.WRONG_PIN:
        waitTime = 10000;
        break;
      case Status.TIMED_OUT:
        setDisplay(<TimedOut />);
        waitTime = 2000;
        break;
      case Status.CHECK_AMOUNT:
        setDisplay(<OneMoment />); 
        waitTime = 1000;
        break;
      case Status.PIN_ERROR:
        rejectTransaction(token, transactionState.transactionId, 'FAIL') 
        setDisplay(<PinError actionFailureType={'FAIL'} />);
        waitTime = 4500;
        break;
      case Status.AMOUNT_ERROR:
        rejectTransaction(token, transactionState.transactionId, 'DECLINE') 
        setDisplay(<PinError actionFailureType={'DECLINE'} />);
        waitTime = 4500;
        break;
      case Status.UPDATE_TRANSACTION:
        setDisplay(<OneMoment />); 
        waitTime = 500;
        break;
      case Status.SUCCESS:
        setDisplay(<Success />);
        waitTime = 3500;
        break;
      case Status.STOPPED:
        setStatus(Status.OUT_OF_ORDER);
        break;
    }
    if (intervalId) {
      clearInterval(intervalId);
    }
    // when in the designated state, execute ↓ this ↓ AFTER the spicified waittime
    if (waitTime) {
      intervalId = setInterval(async () => {
        switch (status) {
          case Status.START_UP:
            init === false ? setStatus(Status.OUT_OF_ORDER) : setStatus(Status.IDLE)
            break;
          case Status.IDLE:
            acceptTransactionStatusCode = await acceptTransaction(token, setTransactionState);
            (acceptTransactionStatusCode === 200) ? setStatus(Status.CHOOSE_METHOD) : null;
            break;
          case Status.CHOOSE_METHOD:
            setStatus(Status.TIMED_OUT);
            break;
          case Status.ACTIVE_METHOD:
            if ((activePayMethod === PayMethod.CONTACTLESS && transactionState.amountToPay <= cardlessSecurityPoint) || activePayMethod === PayMethod.SMARTPHONE ) {
              setStatus(Status.CHECK_AMOUNT);
            } else {
              setStatus(Status.PIN_ENTRY);
            }
            break;
          case Status.STOP_TRANSACTION:
            stopTransaction();
            setStatus(Status.IDLE);
            break;
          case Status.SERVER_ERROR:
            stopTransaction();
            setStatus(Status.IDLE);
            break;  
          case Status.WAITING:
            setStatus(Status.TIMED_OUT);
            break;
          case Status.PIN_ENTRY:
            setStatus(Status.TIMED_OUT);
            break;
          case Status.TIMED_OUT:
            stopTransaction();
            setStatus(Status.IDLE);
            break;
          case Status.WRONG_PIN:
            setStatus(Status.TIMED_OUT);
            break;
            case Status.CHECK_PIN:
              if ((currentPin !== correctPin && currentPin !== negBalancePin) && pinAttempts === 3) {
                // Too many attempts
                setStatus(Status.PIN_ERROR);
              } else if (currentPin !== correctPin && currentPin !== negBalancePin) {
                // Try again (counter is located in the payHandler)
                setPinDigits(['', '', '', '']);
                setStatus(Status.WRONG_PIN);
              } else {
                setStatus(Status.CHECK_AMOUNT);
              }
              break;
            case Status.CHECK_AMOUNT:
                // You do not have enough money!
                if (currentPin === negBalancePin) {
                  setStatus(Status.AMOUNT_ERROR);
              } else {
                // other conditions.. so if pin is correct but also when payMethod = contactless
                setStatus(Status.UPDATE_TRANSACTION);                
              }
              break;
            case Status.UPDATE_TRANSACTION:
              updateTransactionStatusCode = await updateTransaction(token, transactionState.transactionId, transactionState.amountToPay, setStatus);
              (updateTransactionStatusCode === 200) ? setStatus(Status.SUCCESS) : setStatus(Status.SERVER_ERROR);
              break;
            case Status.PIN_ERROR || Status.AMOUNT_ERROR :
              setStatus(Status.IDLE);
              break;
            case Status.AMOUNT_ERROR :
              setStatus(Status.IDLE);
              break;
            case Status.SUCCESS:
              setStatus(Status.IDLE);
              break;
        }
      }, waitTime);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [activePayMethod, currentPin, init, pinAttempts, status, stopTransaction, token, transactionState.amountToPay, transactionState.transactionId]);

  const logTerminalTokenAndTransactionState = React.useCallback(() => {
    console.log(token);
    console.log(transactionState);
  }, [token, transactionState]); 

  return (
    <>
      <AppSettings hide={hideSettings} onHide={settingsButtonHandler} />
      <SelectScheme hide={hidePayProviders} onHide={payProviderButtonHandler} />
      <S.Container>
        <S.Header onClick={logTerminalTokenAndTransactionState}>Payment Terminal</S.Header>
        <TimeRibbon />
 
  
        <S.Content>

          { status === Status.START_UP ||
            status === Status.OUT_OF_ORDER ||
            status === Status.IDLE ||
            status === Status.SERVER_ERROR ||
            status === Status.STOP_TRANSACTION ||
            status === Status.CHECK_PIN ||
            status === Status.TIMED_OUT ||
            status === Status.CHECK_AMOUNT ||
            status === Status.PIN_ERROR ||
            status === Status.AMOUNT_ERROR ||
            status === Status.UPDATE_TRANSACTION ||
            status === Status.SUCCESS ? 
          <div style={{margin: 'auto'}}>{display}</div> : null 
}


        <ActiveTransaction
          chooseMethodHandler={chooseMethodHandler}
          activePayMethod={activePayMethod}
          handleButtonClick={handleButtonClick}
          stopHandler={stopTransaction}
          payHandler={payHandler}
          currentState={status}
          pinDigits={pinDigits}
          amount={transactionState.amountToPay} />
        
        </S.Content>
        <S.Footer>
          <S.SettingsButton>
          <SettingsIcon
            width={18}
            height={18}
            onClick={settingsButtonHandler}
            style={{ cursor: 'pointer' }}
          /></S.SettingsButton>
          <PayOptions onClick={payProviderButtonHandler}>
            <S.PayProviderBorder><PayProvider width={47} height={30} provider={state.selectedScheme}/></S.PayProviderBorder>
            <ExpandIcon width={16} height={13} />
          </PayOptions>
        </S.Footer>
      </S.Container>
    </>
  );
};

export default PaymentTerminal;        
