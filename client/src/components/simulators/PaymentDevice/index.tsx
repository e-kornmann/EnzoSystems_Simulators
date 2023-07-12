
import * as S from './styles';
import { useEffect, useState } from 'react';
import api from "../../../api";
import Amount from './displays/Amount';
import TimedOut from './displays/TimedOut';
import Welcome from './displays/Welcome';
import OneMoment from './displays/OneMoment';
import Success from './displays/Success';
import Cancel from './displays/Cancel';
import DeadEntry from './displays/DeadEntry';
import React from 'react';
import ServerError from './displays/ServerError';
import { Loading } from './displays/Loading';


type Post = {
  terminalId: string;
  amount: number | undefined;
}

const postDataInitialState = 
{ terminalId: '', amount: undefined }

  const PaymentDevice = () => { 
  const [postData, setPostData] = useState<Post>(postDataInitialState);
  const [transactionId, setTransactionId] = useState('');
  const [display, setDisplay] = useState(<Welcome />);
  const [currentDate, setCurrentDate] = useState(
    new Date().toLocaleDateString()
  );
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  const startPayment = React.useCallback(async () => {
    try {
      setDisplay(<Loading />);
      const response = await api.post(`/payment_terminal/${postData.terminalId}/payment`, {
        amount : postData.amount,
      });
      setTransactionId(response.data.transactionId);
      setTimeout(()=>  setDisplay(<Amount amount={postData.amount} />), 1000)
     
    } catch (error) {
      console.error('Unable to make payment.', error);
      if ((error as { response?: { status?: number } }).response?.status) {
        const statusCode = (error as { response: { status: number } }).response.status;
        setDisplay(<ServerError statusCode={statusCode} />);
      }
    }
  }, [postData.amount, postData.terminalId]);

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
    let waitTime: number | undefined = undefined;
    let intervalId: NodeJS.Timer | null = null;
  
    switch (status) {
      case Status.IDLE:
        setDisplay(<Welcome />);
        break;
      case Status.START:
        startPayment();
        waitTime = 7000;
        break;
      case Status.STOP:
        setDisplay(<Cancel />);
        waitTime = 4500;
        break;
      case Status.TIMED_OUT:
        setDisplay(<TimedOut />);
        waitTime = 2000;
        break;
      case Status.PAY:
        setDisplay(<OneMoment />);
        waitTime = 2500;
        break;
      case Status.SUCCESS:
        setDisplay(<Success />);
        waitTime = 5000;
        break;
      case Status.DEAD_ENTRY:
        setDisplay(<DeadEntry />);
        waitTime = 500;
        break;
    }
  
    if (intervalId) {
      clearInterval(intervalId);
    }
  
    if (waitTime) {
      intervalId = setInterval(() => {
        switch (status) {
          case 1:
            setStatus(Status.TIMED_OUT);
            break;
          case 3:
            setStatus(Status.IDLE);
     
            break;
          case 4:
            setStatus(Status.IDLE);
            setPostData(postDataInitialState);
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
  }, [Status.IDLE, Status.SUCCESS, Status.TIMED_OUT, status, postData.amount, startPayment, Status.START, Status.STOP, Status.PAY, Status.DEAD_ENTRY]);



  const startSequence = () => {
    setPostData({ terminalId: '123', amount: 1000 } );
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

  postData.terminalId ? 
   console.log('pay request received from terminal: ' + postData.terminalId + ' \n with Transaction IDnr: ' + transactionId) : 
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

