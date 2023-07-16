import * as S from './styles';
import { useEffect, useState } from 'react';
import api from '../../../api';
import AmountPresent from './displays/AmountPresent';
import TimedOut from './displays/TimedOut';
import Welcome from './displays/Welcome';
import OneMoment from './displays/OneMoment';
import Success from './displays/Success';
import Cancel from './displays/Cancel';
import DeadEntry from './displays/DeadEntry';
import React from 'react';
import ServerError from './displays/ServerError';
import { Loading } from './displays/Loading';
import Failure from './displays/Failure';
import SettingsIcon from '../../shared/svgcomponents/Settings';
import ExpandIcon from '../../shared/svgcomponents/Expand';
import { PayOptions } from './styles';
import CurrentPayProvider from '../../shared/svgcomponents/PayProviders/CurrentPayProvider';
import Buttons from './buttons';
import AmountPinEntry from './displays/AmountPinEntry';
import AmountFail from './displays/AmountFail';

type Post = {
  terminalId: string;
  amount: number | undefined;
};

const postDataInitialState = { terminalId: '', amount: undefined };

enum Status {
  IDLE,
  WAITING,
  PIN_ENTRY,
  STOP,
  PIN_FAILURE,
  ONE_MOMENT,
  TIMED_OUT,
  FAILURE,
  SUCCESS,
}


const PaymentDevice = () => {
  const [pinDigits, setPinDigits] = useState(["", "", "", ""]);

  const currentPin = pinDigits.join("");

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

  const [postData, setPostData] = useState<Post>(postDataInitialState);
  const [transactionId, setTransactionId] = useState('');
  const [showPinEntry, setShowPinEntry] = useState(false);
  const [showBottomButtons, setShowBottomButtons] = useState(false);
  const [display, setDisplay] = useState(<Welcome />);
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  

  const [status, setStatus] = useState(Status.IDLE);

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
  



  

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
      setCurrentDate(new Date().toLocaleDateString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    
    
    let waitTime: number | undefined = undefined;
    let intervalId: NodeJS.Timer | null = null;

    switch (status) {
      case Status.IDLE:
        setDisplay(<Welcome />);
        setPostData(postDataInitialState);
        setShowBottomButtons(false);
        setPinDigits(['','','','']);
        break;
      case Status.WAITING:
        startPayment();
        setShowBottomButtons(true);
        setStatus(Status.WAITING);
        setDisplay(<AmountPresent amount={postData.amount} />)
        waitTime = 7000;
        break;
      case Status.STOP:
        setDisplay(<Cancel />);
        waitTime = 4500;
        break;
      case Status.PIN_ENTRY:
        setDisplay(<AmountPinEntry amount={postData.amount} />)
        waitTime = 10000;
        break;
      case Status.TIMED_OUT:
        setDisplay(<TimedOut />);
        waitTime = 2000;
        break;
      case Status.ONE_MOMENT:
        setDisplay(<OneMoment />); 
       
        // } else if (currentPin.length === 4 && currentPin !== '') {
        //   setDisplay(<AmountFail amount={postData.amount} />)
        // } else if (currentPin.length === 4) {
        //   setDisplay(<Loading />);
        // } 
        waitTime = 2500;
        break;
      case Status.FAILURE:
        setShowPinEntry(false);
        setDisplay(<Failure />);
        waitTime = 5000;
        break;
      case Status.SUCCESS:
        setDisplay(<Success />);
        waitTime = 4500;
        break;
    }

    if (intervalId) {
      clearInterval(intervalId);
    }
    // when in the specific state specify status after waittime
    if (waitTime) {
      intervalId = setInterval(() => {
        switch (status) {
         case Status.STOP:
            setShowPinEntry(false);
            setStatus(Status.IDLE);
            break;
          case Status.WAITING:
            setStatus(Status.TIMED_OUT);
            break;
          case Status.PIN_ENTRY:
            setStatus(Status.TIMED_OUT);
            break;
          case Status.TIMED_OUT:
            setShowPinEntry(false);
            setStatus(Status.IDLE);
            break;
          case Status.PAY:
            setStatus(Status.SUCCESS);
            break;
          case Status.FAILURE:
            setShowPinEntry(false);
            setStatus(Status.IDLE);
            break;
          case Status.SUCCESS:
             setStatus(Status.IDLE);
             break;
          case Status.DEAD_ENTRY:
            setShowPinEntry(false);
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
  }, [status, postData.amount, startPayment, presentCardHandler, showPinEntry, currentPin]);

  const startSequence = () => {
    setPostData({ terminalId: '123', amount: 100 });
    setStatus(Status.START);
  };

  const presentCardHandler = React.useCallback(() => {
    setShowPinEntry(true);
    setStatus(Status.PIN_ENTRY)
 }, []);

  const payHandler = () => (currentPin !== '1322') 
    ? setStatus(Status.PIN_FAILURE): setStatus(Status.ONE_MOMENT);

  const stopHandler = () => setStatus(Status.STOP);

  postData.terminalId
    ? console.log(
        'pay request received from terminal: ' +
          postData.terminalId +
          ' \n with Transaction IDnr: ' +
          transactionId
      )
    : console.log('start a payment');


  return (
    <>
      <S.Container>
        <S.Header>Payment Terminal</S.Header>
        <S.TimeRibbon>
          <div>{currentDate}</div>
          <div>{currentTime}</div>
        </S.TimeRibbon>
        <S.TextBox $aligntop={showPinEntry}>
          <div>{display}</div>
        </S.TextBox>
    
    
       <Buttons 
        handleButtonClick={handleButtonClick} 
        stopHandler={stopHandler} 
        payHandler={payHandler} 
        showBottomButtons={showBottomButtons} 
        showPinEntry={showPinEntry}  
        pinDigits={pinDigits} />
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
      ) : status === Status.WAITING ? (
        <S.StateButton onClick={presentCardHandler}>PRESENT</S.StateButton>
      ) : null}
    </>
  );
};

export default PaymentDevice;

