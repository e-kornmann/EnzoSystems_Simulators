import * as S from './styles';
import { useEffect, useState } from 'react';
import api from '../../../api';
import TimedOut from './displays/TimedOut';
import Welcome from './displays/Welcome';
import OneMoment from './displays/OneMoment';
import Success from './displays/Success';
import Cancel from './displays/Cancel';
import React from 'react';
import ServerError from './displays/ServerError';
import { Loading } from './displays/Loading';
import Failure from './displays/Failure';
import SettingsIcon from '../../shared/svgcomponents/Settings';
import ExpandIcon from '../../shared/svgcomponents/Expand';
import { PayOptions } from './styles';
import CurrentPayProvider from '../../shared/svgcomponents/PayProviders/CurrentPayProvider';
import Buttons from './buttons';
import ChoosePayMethod from './displays/ChoosePayMethod';
import Amount from './displays/Amount';

type Post = {
  terminalId: string;
  amount: number | undefined;
};

const postDataInitialState = { terminalId: '', amount: undefined };

const correctPin = import.meta.env.VITE_PINCODE_SUCCEEDED;
const negBalancePin = import.meta.env.VITE_NEGBALANCE;
const cardlessSecurityPoint = import.meta.env.VITE_CARDLESS_SECURITY_POINT;
const terminalId = import.meta.env.VITE_TERMINAL_ID;
const amountToPay = import.meta.env.VITE_AMOUNT_TO_PAY;


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
  const [status, setStatus] = useState(Status.IDLE);
  const [activePayMethod, setActivePayMethod] = useState(PayMethod.NONE)
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);
  const [pinAttempts, setPinAttempts] = useState(0);
  const [postData, setPostData] = useState<Post>(postDataInitialState);
  const [transactionId, setTransactionId] = useState('');
  const [showBottomButtons, setShowBottomButtons] = useState(false);
  const [display, setDisplay] = useState(<Welcome />);
  const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  
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

  const startPayment = React.useCallback(async () => {
      try {
      setDisplay(<Loading />);
      const response = await api.post(
        `/payment_terminal/${postData.terminalId}/payment`,
        {
          amount: postData.amount,
        }
      );
      setTransactionId(response.data.transactionId);
    
      } catch (error) {
        console.error('Unable to make payment.', error);
        if ((error as { response?: { status?: number } }).response?.status) {
          const statusCode = (error as { response: { status: number } }).response
          .status;
          setDisplay(<ServerError statusCode={statusCode} />);
        } else {
        setDisplay(<ServerError statusCode={500} />);
        }
      }
  }, [postData.amount, postData.terminalId]);

  // React.useEffect(() => {
  //   if (getReceipt === 'You have paid.') {
  //     setStatus(Status.SUCCESS);
  // }}, [Status.SUCCESS, getReceipt]);
  
  // const payAmount = React.useCallback(async () => {
  //   try {
  //     setDisplay(<OneMoment />);
  //     const response = await api.get(
  //       `/payment_terminal/${postData.terminalId}/payment/${transactionId}`
  //     );
  //     setGetReceipt(response.data.receipt);
  //   } catch (error) {
  //     console.error('Unable to make payment.', error);
  //     setStatus(Status.FAILURE);
  //   }
  // }, [Status.FAILURE, postData.terminalId, transactionId]);
  

  
  const startSequence = () => { setPostData({ terminalId: terminalId, amount: amountToPay }); setStatus(Status.CHOOSE_METHOD); };
  const chooseMethodHandler = (method: PayMethod) => { setStatus(Status.ACTIVE_METHOD); setActivePayMethod(method); };
  const presentCardHandler = React.useCallback(() => setStatus(Status.PIN_ENTRY), [])
  const payHandler = () => { 
    if (currentPin.length === 4) {
    setPinAttempts(pinAttempts+1); 
    setStatus(Status.CHECK_PIN);
    } 
  }
  const stopHandler = () => setStatus(Status.STOP);

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
        waitTime = 1000;  
        break;
      case Status.WAITING:
        startPayment();
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
        setDisplay(<Failure />);
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
  }, [status, postData.amount, startPayment, presentCardHandler, currentPin, pinAttempts, activePayMethod]);

  postData.terminalId
    ? console.log(
        'pay request received from terminal: ' +
          postData.terminalId +
          ' \n with Transaction IDnr: ' +
          transactionId
      )
    : console.log('start a payment');



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
          {status === Status.CHOOSE_METHOD ||
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
          <SettingsIcon width={18} height={18} />
          <PayOptions>
            <CurrentPayProvider width={48} height={28} provider={'applepay'} />
            <ExpandIcon width={16} height={13} />
          </PayOptions>
        </S.Footer>
      </S.Container>

      {status === Status.IDLE ? (
        <S.StateButton onClick={startSequence}>
          I want to pay my booking from € 1000
        </S.StateButton>
      ) : null}
    </>
  );
};

export default PaymentDevice;