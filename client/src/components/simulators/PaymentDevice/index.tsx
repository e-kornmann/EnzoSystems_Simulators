
import * as S from './styles';
import { useEffect, useState } from 'react';

import Amount from './displays/Amount';
import TimedOut from './displays/TimedOut';
import Welcome from './displays/Welcome';
import OneMoment from './displays/OneMoment';
import Success from './displays/Success';
import Cancel from './displays/Cancel';
import DeadEntry from './displays/DeadEntry';


  const PaymentDevice = () => {
  const [terminalId, setTerminalId] = useState('');
  const [transaction, setTransaction] = useState({
    transactionId: '',
    amount: 0,
  });
  const [display, setDisplay] = useState(<Welcome />);
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  enum Status {
    IDLE,
    START,
    PIN_ENTRY,
    STOP,
    TIMED_OUT,
    FAILURE,
    PAY,
    SUCCESS,
    DEAD_ENTRY,
  }
  const [status, setStatus] = useState(Status.IDLE);

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
    let waitTime;
    let intervalId: NodeJS.Timer | null = null;
  
    switch (status) {
      case 0:
        setDisplay(<Welcome />);
        setTransaction({
          transactionId: '',
          amount: 0,
        });
        setTerminalId('');
        break;
      case 1:
        setDisplay(<Amount amount={1000} />);
        waitTime = 7000;
        break;
      case 3:
        setDisplay(<Cancel />);
        waitTime = 4500;
        break;
      case 4:
        setDisplay(<TimedOut />);
        waitTime = 2000;
        break;
      case 6:
        waitTime = 2500;
        setDisplay(<OneMoment />);
        break;
      case 7:
        waitTime = 5000;
        setDisplay(<Success />);
        break;
      case 8:
        waitTime = 500;
        setDisplay(<DeadEntry />);
        break;
    }
  
    if (intervalId) {
      clearInterval(intervalId);
    }
  
    if (waitTime) {
      intervalId = setInterval(() => {
        switch (status) {
          case 0:
            break;
          case 1:
            setStatus(Status.TIMED_OUT);
            break;
          case 3:
            setStatus(Status.IDLE);
            break;
          case 4:
            setStatus(Status.IDLE);
            break;
          case 6:
            setStatus(Status.SUCCESS);
            break;
          case 7:
            setStatus(Status.IDLE);
            break;
          case 8:
            setStatus(Status.IDLE);
            break;
        }
      }, waitTime);
    }
  
    console.log(status);
  
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [Status.IDLE, Status.SUCCESS, Status.TIMED_OUT, status]);

  const startSequence = () => {
    setTerminalId('123');
    setTransaction({
      transactionId: '123456',
      amount: 1000,
    });
    setStatus(Status.START);
  };

  const payHandler = () => {
    if (status !== Status.START) {
      setStatus(Status.DEAD_ENTRY);
    } else {
      setStatus(Status.PAY);
    }
  };

  const stopHandler = () => {
    if (status !== Status.START) {
      setStatus(Status.DEAD_ENTRY);
    } else {
      setStatus(Status.STOP);
    }
  };

  terminalId ? 
   console.log('pay request received from terminal:' + terminalId + 'with \nTransacion IDnr:' + transaction.transactionId) : 
   console.log('start a payment') 
   ;

  return (
    <>
      <S.Container>
        <S.Header>Payment Terminal</S.Header>
        <S.TimeRibbon>
          <div>{currentDate}</div>
          <div>{currentTime}</div>
        </S.TimeRibbon>
        <S.TextBox>
          <div>{display}</div>
        </S.TextBox>
      <S.ButtonContainer>
        <S.NrButton>1</S.NrButton>
        <S.StopButton onClick={stopHandler}>Stop</S.StopButton>
        <S.CorrectButton>Correct</S.CorrectButton>
        <S.OkButton onClick={payHandler}>OK</S.OkButton>
      </S.ButtonContainer>
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

