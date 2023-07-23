import * as S from './styles';
import { useEffect, useState } from 'react';
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
import { PayOptions } from './styles';
import CurrentPayProvider from '../../shared/svgcomponents/PayProviders/CurrentPayProvider';
import Buttons from './buttons';
import ChoosePayMethod from './displays/ChoosePayMethod';
import Amount from './displays/Amount';
import AppSettings from './Personalisation/AppSettings/AppSettings';
import NotConnected from './displays/NotConnected';
import ServerError from './displays/ServerError';
import useLogOn from '../../../hooks/useLogOn';
import { pinTerminalCredentials, reqBody } from './config';
import useStopTransactionTerminal from './utils/useStopTransactionTerminal';
import { rejectTransaction } from './utils/rejectTransaction';
import { updateTransaction } from './utils/updateTransaction';
import { AcceptTransactionStateType } from './types';
import acceptTransaction from './utils/acceptTransaction';

const correctPin = import.meta.env.VITE_PINCODE_SUCCEEDED;
const negBalancePin = import.meta.env.VITE_NEGBALANCE;
const cardlessSecurityPoint = import.meta.env.VITE_CARDLESS_SECURITY_POINT;


export enum Status {
  START_UP,
  OUT_OF_ORDER,
  IDLE,
  UPDATE_TRANSACTION,
  SERVER_ERROR,
  CHOOSE_METHOD,
  ACTIVE_METHOD,
  WAITING,
  PIN_ENTRY,
  CHECK_PIN,
  STOP_TRANSACTION,
  WRONG_PIN,
  CHECK_AMOUNT,
  TIMED_OUT,
  PIN_ERROR,
  AMOUNT_ERROR,
  SUCCESS,
  STOPPED,
}

export enum PayMethod {
  NONE,
  SMARTPHONE,
  CONTACTLESS,
  CARD,
}

type Props = {
  isClosed: boolean;
}

const PaymentDevice = ({isClosed}: Props) => {
  const { token, logOn } = useLogOn(pinTerminalCredentials, reqBody);
  const [status, setStatus] = useState(Status.START_UP);
  const [ transactionState, setTransactionState] = useState<AcceptTransactionStateType>({ transactionId: '', amountToPay: 0 });
  const { stopTransaction } = useStopTransactionTerminal(token, transactionState.transactionId, setStatus);
  const [activePayMethod, setActivePayMethod] = useState(PayMethod.NONE)
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [showBottomButtons, setShowBottomButtons] = useState(false);
  const [display, setDisplay] = useState(<Welcome />);
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [hideSettings, setHideSettings] = useState(true);
  const [init, setInit] = useState(false);


  useEffect(() => {
    if (init === false) {
      setInit(true);
      const doLogOn = async () => {
        const logOnSucceeded = await logOn();
        setInit(logOnSucceeded);
      };
      doLogOn();
    }
    if (isClosed === true) {
      //log off
      setStatus(Status.STOPPED);
      setInit(false);
    }
  }, [init, isClosed, logOn]);

  
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
        setShowBottomButtons(false);
        setPinDigits(['','','','']);
        waitTime= 2000;
        break;
      case Status.SERVER_ERROR:
        setDisplay(<ServerError statusCode={updateTransactionStatusCode}  />);
        waitTime = 4500;
        break;
      case Status.CHOOSE_METHOD:
        setShowBottomButtons(true);
        setDisplay(<Amount currentState={status} amount={transactionState.amountToPay} />)
        waitTime = 12000;  
        break;
      case Status.ACTIVE_METHOD:
        setDisplay(<Amount currentState={status} amount={transactionState.amountToPay} />)
        waitTime = 500;  
        break;
      case Status.WAITING:
        setShowBottomButtons(true);
        setDisplay(<Amount currentState={status} amount={transactionState.amountToPay}  />)
        waitTime = 7000;  
        break;
      case Status.STOP_TRANSACTION:
        setDisplay(<Cancel />);
        waitTime = 4500;
        break;
      case Status.PIN_ENTRY:
        setDisplay(<Amount currentState={status} amount={transactionState.amountToPay} />)
        waitTime = 10000;
        break;
     case Status.CHECK_PIN:
        setDisplay(<Loading/>);
        waitTime = 1500;
        break;
      case Status.WRONG_PIN:
        setDisplay(<Amount currentState={status} amount={transactionState.amountToPay} />)
        waitTime = 10000;
        break;
      case Status.TIMED_OUT:
        setShowBottomButtons(false);
        setDisplay(<TimedOut />);
        waitTime = 2000;
        break;
      case Status.CHECK_AMOUNT:
        setShowBottomButtons(false);
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
    // when in the specific state, execute this AFTER waittime
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
             setStatus(Status.IDLE);
             break;
          case Status.SERVER_ERROR:
              setStatus(Status.IDLE);
              break;  
          case Status.WAITING:
            setStatus(Status.TIMED_OUT);
            break;
          case Status.PIN_ENTRY:
            setStatus(Status.TIMED_OUT);
            break;
          case Status.TIMED_OUT:
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
  }, [activePayMethod, currentPin, init, pinAttempts, status, token, transactionState.amountToPay, transactionState.transactionId]);

  useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date().toLocaleTimeString());
        setCurrentDate(new Date().toLocaleDateString());
      }, 1000);
  
      return () => {
        clearInterval(timer);
      };
  }, []);



  const logTerminalTokenAndTransactionState = React.useCallback(() => {
    console.log(token);
    console.log(transactionState);
  }, [token, transactionState]); 

  return (
    <>
      <AppSettings hide={hideSettings} onHide={settingsButtonHandler} />
      <S.Container>
        <S.Header onClick={logTerminalTokenAndTransactionState}>Payment Terminal</S.Header>
        <S.TimeRibbon>
          <div>{currentDate}</div>
          <div>{currentTime}</div>
        </S.TimeRibbon>
        <S.TextBox
          $aligntop={
            status === Status.PIN_ENTRY ||
            status === Status.WRONG_PIN ||
            status === Status.CHOOSE_METHOD ||
            status === Status.ACTIVE_METHOD ||
            status === Status.CHECK_PIN
          }
        >
          <div>{display}</div>
          { status === Status.CHOOSE_METHOD ||
            status === Status.ACTIVE_METHOD ? (
            <ChoosePayMethod
              chooseMethodHandler={chooseMethodHandler}
              activePayMethod={activePayMethod}
              currentState={status}
            />
          ) : null}
        </S.TextBox>

        <Buttons
          handleButtonClick={handleButtonClick}
          stopHandler={stopTransaction}
          payHandler={payHandler}
          currentState={status}
          showBottomButtons={showBottomButtons}
          pinDigits={pinDigits}
        />

        <S.Footer>
          <SettingsIcon
            width={18}
            height={18}
            onClick={settingsButtonHandler}
            style={{ cursor: 'pointer' }}
          />
          <PayOptions>
            <CurrentPayProvider width={48} height={28} provider={'applepay'} />
            <ExpandIcon width={16} height={13} />
          </PayOptions>
        </S.Footer>
      </S.Container>
    </>
  );
};

export default PaymentDevice;

