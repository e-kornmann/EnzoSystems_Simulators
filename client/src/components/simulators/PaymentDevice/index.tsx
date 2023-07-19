import * as S from './styles';
import { useEffect, useState } from 'react';
import TimedOut from './displays/TimedOut';
import Welcome from './displays/Welcome';
import OneMoment from './displays/OneMoment';
import Success from './displays/Success';
import Cancel from './displays/Cancel';
import React from 'react';
import { Loading } from './displays/Loading';
import Failure from './displays/Failure';
import { ReactComponent as SettingsIcon } from '../../../assets/svgs/settings.svg';
import ExpandIcon from '../../shared/svgcomponents/Expand';
import { PayOptions } from './styles';
import CurrentPayProvider from '../../shared/svgcomponents/PayProviders/CurrentPayProvider';
import Buttons from './buttons';
import ChoosePayMethod from './displays/ChoosePayMethod';
import Amount from './displays/Amount';
import AppSettings from './Personalisation/AppSettings/AppSettings';
import useLogOnTerminal from '../../../hooks/terminal/useLogOnTerminal';
import useThisTransaction from '../../../hooks/terminal/useThisTransaction';


type Post = {
  terminalId: string;
  amount: number | undefined;
};

const postDataInitialState = { terminalId: '', amount: undefined };

const correctPin = import.meta.env.VITE_PINCODE_SUCCEEDED;
const negBalancePin = import.meta.env.VITE_NEGBALANCE;
const cardlessSecurityPoint = import.meta.env.VITE_CARDLESS_SECURITY_POINT;
const amountToPay = import.meta.env.VITE_AMOUNT_TO_PAY;

// out of order state toevoegen
export enum Status {
  IDLE,
  CHOOSE_METHOD,
  ACTIVE_METHOD,
  WAITING,
  PIN_ENTRY,
  CHECK_PIN,
  STOP,
  PIN_FAILURE,
  CHECK_AMOUNT,
  TIMED_OUT,
  FAILURE,
  SUCCESS,
}

export enum PayMethod {
  NONE,
  SMARTPHONE,
  CONTACTLESS,
  CARD,
}

const PaymentDevice = () => {
  const { terminalToken, logOn } = useLogOnTerminal();
  // check met Erik ff de benaming;
  const { transactionState, getTransaction } = useThisTransaction(terminalToken);
  const [init, setInit] = useState(false);
  const [status, setStatus] = useState(Status.IDLE);
  const [activePayMethod, setActivePayMethod] = useState(PayMethod.NONE)
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [postData, setPostData] = useState<Post>(postDataInitialState);
  const [showBottomButtons, setShowBottomButtons] = useState(false);
  const [display, setDisplay] = useState(<Welcome />);
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [hideSettings, setHideSettings] = useState(true);



  useEffect(() => {
    if (!init) {
      logOn();
      setInit(true);
    } else {
      // out of order state veranderen
      setStatus(Status.FAILURE);
    }
    
  }, [logOn, init, getTransaction])

    console.log(terminalToken);
    console.log(transactionState);

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

  const startSequence = () => { getTransaction(); setStatus(Status.CHOOSE_METHOD); };
  const chooseMethodHandler = (method: PayMethod) => { setStatus(Status.ACTIVE_METHOD); setActivePayMethod(method); };
  const presentCardHandler = React.useCallback(() => setStatus(Status.PIN_ENTRY), [])
  const payHandler = () => { 
    if (currentPin.length === 4) {
    setPinAttempts(pinAttempts+1); 
    setStatus(Status.CHECK_PIN);
    } 
  }
  const stopHandler = () => setStatus(Status.STOP);
  const settingsButtonHandler = () => setHideSettings(!hideSettings);

  useEffect(() => {
    
    let waitTime: number | undefined = undefined;
    let intervalId: NodeJS.Timer | null = null;

    switch (status) {
      case Status.IDLE:
        setDisplay(<Welcome />);
        setPinAttempts(0);
        setActivePayMethod(PayMethod.NONE);
        setPostData(postDataInitialState);
        setShowBottomButtons(false);
        setPinDigits(['','','','']);
        break;
      case Status.CHOOSE_METHOD:
        setShowBottomButtons(true);
        setDisplay(<Amount currentState={status} amount={postData.amount} />)
        waitTime = 7000;  
        break;
      case Status.ACTIVE_METHOD:
        setDisplay(<Amount currentState={status} amount={postData.amount} />)
        waitTime = 500;  
        break;
      case Status.WAITING:

        setShowBottomButtons(true);
        setDisplay(<Amount currentState={status} amount={postData.amount}  />)
        waitTime = 7000;  
        break;
      case Status.STOP:
        setDisplay(<Cancel />);
        waitTime = 4500;
        break;
      case Status.PIN_ENTRY:
        setDisplay(<Amount currentState={status} amount={postData.amount} />)
        waitTime = 10000;
        break;
     case Status.CHECK_PIN:
        setDisplay(<Loading/>);
        waitTime = 1500;
        break;
      case Status.PIN_FAILURE:
        setDisplay(<Amount currentState={status} amount={postData.amount} />)
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
        waitTime = 1500;
        break;
      case Status.FAILURE:
        setDisplay(<Failure currentPin={currentPin} />);
        waitTime = 4500;
        break;
      case Status.SUCCESS:
        setDisplay(<Success />);
        waitTime = 3500;
        break;
    }

    if (intervalId) {
      clearInterval(intervalId);
    }
    // when in the specific state, execute this AFTER waittime
    if (waitTime) {
      intervalId = setInterval(() => {
        switch (status) {
          case Status.STOP:
            setStatus(Status.IDLE);
            break;
          case Status.CHOOSE_METHOD:
            setStatus(Status.TIMED_OUT);
            break;
          case Status.ACTIVE_METHOD:
            if ((activePayMethod === PayMethod.CONTACTLESS && amountToPay <= cardlessSecurityPoint) || activePayMethod === PayMethod.SMARTPHONE ) {
              setStatus(Status.CHECK_AMOUNT);
            } else {
              setStatus(Status.PIN_ENTRY);
            }

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
          case Status.PIN_FAILURE:
            setStatus(Status.TIMED_OUT);
            break;
            case Status.CHECK_PIN:
              if ((currentPin !== correctPin && currentPin !== negBalancePin) && pinAttempts === 3) {
                // Too many attempts
                setStatus(Status.FAILURE);
              } else if (currentPin !== correctPin && currentPin !== negBalancePin) {
                // Try again (counter is located in the payHandler)
                setPinDigits(['', '', '', '']);
                setStatus(Status.PIN_FAILURE);
              } else {
                setStatus(Status.CHECK_AMOUNT);
              }
              break;
            case Status.CHECK_AMOUNT:
                // You do not have enough money!
                if (currentPin === negBalancePin) {
                  setStatus(Status.FAILURE);
              } else {
                // other conditions.. so if pin is correct but also when payMethod = contactless
                setStatus(Status.SUCCESS);
              }
              break;
          case Status.FAILURE:
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
  }, [status, postData.amount, presentCardHandler, currentPin, pinAttempts, activePayMethod]);





  useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date().toLocaleTimeString());
        setCurrentDate(new Date().toLocaleDateString());
      }, 1000);
  
      return () => {
        clearInterval(timer);
      };
  }, []);
 

  return (
    <>
      <AppSettings hide={hideSettings} onHide={settingsButtonHandler} />
      <S.Container>
        <S.Header>Payment Terminal</S.Header>
        <S.TimeRibbon>
          <div>{currentDate}</div>
          <div>{currentTime}</div>
        </S.TimeRibbon>
        <S.TextBox
          $aligntop={
            status === Status.PIN_ENTRY ||
            status === Status.PIN_FAILURE ||
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
          stopHandler={stopHandler}
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

      {status === Status.IDLE && hideSettings === true ? (
        <S.StateButton onClick={startSequence}>Pay the bill</S.StateButton>
      ) : null}
    </>
  );
};

export default PaymentDevice;