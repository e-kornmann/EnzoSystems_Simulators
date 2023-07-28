import styled from 'styled-components';
import React, { useState, useEffect, useCallback, useRef } from 'react';

/*****************************
// Title bar
******************************/

const StyledTitlebar = styled.div`
  color: white;
  background-color: black;
  width: 100%;
  height: 50px;
  position: absolute;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledTitlebarButtonLeft = styled.div`
  color: white;
  background-color: white;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 15px;
  left: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledTitlebarButtonRight = styled.div`
  color: white;
  background-color: white;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 15px;
  right: 15px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Titlebar (props) {
  return <StyledTitlebar onClick={props.onClickMiddle}> <StyledTitlebarButtonLeft onClick={props.onClickLeft} /><StyledTitlebarButtonRight onClick={props.onClickRight} />Payment terminal Simulator</StyledTitlebar>;
}

/*****************************
// Message
******************************/

const StyledMessage = styled.div`
  color: black;
  // background-color: orange;
  position: absolute;
  top: 150px;
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
`;

function Message (props) {
  let message = '';
  switch (props.transactionState) {
    case TRANSACTION_STATES.IDLE:
      if (props.deviceState === DEVICE_STATES.OUT_OF_ORDER) {
        switch (props.locale) {
          case 'nl-NL':
            message = 'Buiten gebruik';
            break;
          default:
            message = 'Out of order';
            break;
        }
      } else {
        switch (props.locale) {
          case 'nl-NL':
            message = 'Welkom';
            break;
          default:
            message = 'Welcome';
            break;
        }
      }
      break;
    case TRANSACTION_STATES.PRESENT_CARD:
      switch (props.locale) {
        case 'nl-NL':
          message = 'Presenteer kaart';
          break;
        default:
          message = 'Present card';
          break;
      }
      break;
    case TRANSACTION_STATES.PIN_ENTER:
      break;
    case TRANSACTION_STATES.PIN_CONFIRM:
      break;
    case TRANSACTION_STATES.PIN_VERIFY:
      switch (props.locale) {
        case 'nl-NL':
          message = 'Verifieren PIN...';
          break;
        default:
          message = 'Verifying PIN...';
          break;
      }
      break;
    case TRANSACTION_STATES.PIN_VALID:
      switch (props.locale) {
        case 'nl-NL':
          message = 'PIN is correct';
          break;
        default:
          message = 'Correct PIN';
          break;
      }
      break;
    case TRANSACTION_STATES.PIN_INVALID:
      switch (props.pincodeRetries) {
        case 2:
          switch (props.locale) {
            case 'nl-NL':
              message = 'Ongeldige PIN, nog 2 pogingen';
              break;
            default:
              message = 'Invalid PIN, 2 retries left';
              break;
          }
          break;
        case 1:
          switch (props.locale) {
            case 'nl-NL':
              message = 'Ongeldige PIN, nog 1 poging';
              break;
            default:
              message = 'Invalid PIN, 1 attempt left';
              break;
          }
          break;
        default:
          switch (props.locale) {
            case 'nl-NL':
              message = 'Ongeldige PIN, kaart geblokkeerd';
              break;
            default:
              message = 'Invalid PIN, card blocked';
              break;
          }
          break;
      }
      break;
    case TRANSACTION_STATES.PIN_BLOCKED:
      break;
    case TRANSACTION_STATES.PROCESSING:
      switch (props.locale) {
        case 'nl-NL':
          message = 'Even geduld aub';
          break;
        default:
          message = 'One moment please...';
          break;
      }
      break;
    case TRANSACTION_STATES.FINISHED:
      switch (props.transactionResult) {
        case TRANSACTION_RESULTS.APPROVED:
          switch (props.locale) {
            case 'nl-NL':
              message = 'U heeft betaald';
              break;
            default:
              message = 'You have paid';
              break;
          }
          break;
        case TRANSACTION_RESULTS.FAILED:
          switch (props.locale) {
            case 'nl-NL':
              message = 'Betaling is mislukt';
              break;
            default:
              message = 'Payment failed';
              break;
          }
          break;
        case TRANSACTION_RESULTS.DECLINED:
          switch (props.locale) {
            case 'nl-NL':
              message = 'Betaling is geweigerd';
              break;
            default:
              message = 'Payment declined';
              break;
          }
          break;
        case TRANSACTION_RESULTS.STOPPED:
          switch (props.locale) {
            case 'nl-NL':
              message = 'Betaling is gestopt';
              break;
            default:
              message = 'Payment stopped';
              break;
          }
          break;
        case TRANSACTION_RESULTS.TIMED_OUT:
          switch (props.locale) {
            case 'nl-NL':
              message = 'Time out, niets betaald';
              break;
            default:
              message = 'Timeout, nothing paid';
              break;
          }
          break;
        default:
          break;
      }
      break;
    default:
      break;
  }
  return <StyledMessage>{message}</StyledMessage>;
}

/*****************************
// Instruction
******************************/

const StyledInstruction = styled.div`
  color: black;
  // background-color: white;
  position: absolute;
  width: 100%;
  height: 30px;
  top: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function Instruction (props) {
  let instruction = '';
  switch (props.transactionState) {
    case TRANSACTION_STATES.IDLE:
      break;
    case TRANSACTION_STATES.PRESENT_CARD:
      switch (props.locale) {
        case 'nl-NL':
          instruction = 'Bedrag te betalen';
          break;
        default:
          instruction = 'Amount to pay';
          break;
      }
      break;
    case TRANSACTION_STATES.PIN_ENTER:
      switch (props.locale) {
        case 'nl-NL':
          instruction = 'Voer PIN code in';
          break;
        default:
          instruction = 'Enter your PIN code';
          break;
      }
      break;
    case TRANSACTION_STATES.PIN_CONFIRM:
      switch (props.locale) {
        case 'nl-NL':
          instruction = 'Druk OK om te bevestig';
          break;
        default:
          instruction = 'To confirm, press OK';
          break;
      }
      break;
    case TRANSACTION_STATES.PIN_VERIFY:
      break;
    case TRANSACTION_STATES.PIN_VALID:
      break;
    case TRANSACTION_STATES.PIN_INVALID:
      break;
    case TRANSACTION_STATES.PIN_BLOCKED:
      break;
    case TRANSACTION_STATES.PROCESSING:
      break;
    case TRANSACTION_STATES.FINISHED:
      break;
    default:
      break;
  }
  return <StyledInstruction>{instruction}</StyledInstruction>;
}

/*****************************
// Amount
******************************/

const StyledAmount = styled.div`
  color: black;
  // background-color: white;
  position: absolute;
  width: 100%;
  height: 50px;
  top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
`;

function Amount (props) {
  const amountFormat = new Intl.NumberFormat(props.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const amountText = props.currency + ' ' + amountFormat.format(props.amount / 100);
  return <StyledAmount>{amountText}</StyledAmount>;
}

/*****************************
// Pincode
******************************/

const StyledPincode = styled.div`
  color: black;
  position: absolute;
  top: 150px;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
`;

function Pincode (props) {
  let masked = '';
  masked = masked.padStart(props.pincode.length, '*');
  return <StyledPincode>{masked}</StyledPincode>;
}

/*****************************
// Keypad
******************************/

const StyledKeypad = styled.div`
  color: black;
  // background-color: yellow;
  position: absolute;
  top: 200px;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-content: flex-start;
  align-items: start;
  gap: 10px;
`;

const StyledKey = styled.div`
  color: black;
  background-color: white;
  cursor: pointer;
  
  width: 80px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 30px;
  border: 1px solid black;
  border-radius: 3px;

  // pressed
  &:active {
    box-shadow: 0 0 2px 2px grey;
  }
`;

function Key (props) {
  return <StyledKey onClick={props.onClick}>{props.value}</StyledKey>;
}

function Keypad (props) {
  const handleKey = useCallback((e) => {
    if (props.pincode.length >= 4) {
      return;
    }

    let pincode = props.pincode;
    pincode += e.target.innerText;

    console.log(`You clicked ${e.target.innerText}, new pincode value ${pincode}`);
    props.onHandlePincode(pincode);
  }, [props]);

  return (
    <StyledKeypad>
      <Key onClick={handleKey} value='1' /> <Key onClick={handleKey} value='2' /> <Key onClick={handleKey} value='3' />
      <Key onClick={handleKey} value='4' /> <Key onClick={handleKey} value='5' /> <Key onClick={handleKey} value='6' />
      <Key onClick={handleKey} value='7' /> <Key onClick={handleKey} value='8' /> <Key onClick={handleKey} value='9' />
      <Key onClick={handleKey} value='0' />
    </StyledKeypad>
  );
}

/*****************************
// Button bar
******************************/

const StyledStopButton = styled.div`
  color: black;
  background-color: red;
  cursor: pointer;
  
  width: 80px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  border: 1px solid black;
  border-radius: 3px;

  // pressed
  &:active {
    box-shadow: 0 0 2px 2px grey;
  }
`;

const StyledCorrectButton = styled.div`
  color: black;
  background-color: yellow;
  cursor: pointer;

  width: 80px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  border: 1px solid black;
  border-radius: 3px;

  // pressed
  &:active {
    box-shadow: 0 0 2px 2px grey;
  }
`;

const StyledConfirmButton = styled.div`
  color: black;
  background-color: green;
  cursor: pointer;

  width: 80px;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  border: 1px solid black;
  border-radius: 3px;

  // pressed
  &:active {
    box-shadow: 0 0 2px 2px grey;
  }

  // disabled
  // &:disabled {
  //   opacity: 0.25;
  //   cursor: default;
  // }
`;

const StyledButtonbar = styled.div`
  color: white;
  
  position: absolute;
  bottom: 20px;
  
  padding-left:17px;
  
  display: flex;
  flex-flow: row no-wrap;
  justify-content: start;
  align-content: flex-start;
  align-items: start;
  gap: 10px;
`;

function StopButton (props) {
  return <StyledStopButton type='button' onClick={props.onClick}> {props.value}</StyledStopButton>;
}

function CorrectButton (props) {
  return <StyledCorrectButton type='button' onClick={props.onClick}>{props.value}</StyledCorrectButton>;
}

function ConfirmButton (props) {
  return <StyledConfirmButton type='button' disabled onClick={props.onClick}>{props.value}</StyledConfirmButton>;
}

function Buttonbar (props) {
  const handleCorrectButton = useCallback((e) => {
    e.preventDefault();
    console.log('You clicked COR button');
    props.onResetPincode('');
  }, [props]);

  const handleConfirmButton = useCallback((e) => {
    e.preventDefault();
    console.log('You clicked OK button');
    props.onConfirm();
  }, [props]);

  const handleStopButton = useCallback((e) => {
    e.preventDefault();
    console.log('You clicked STOP button');
    props.onStop();
  }, [props]);

  return (
    <StyledButtonbar>
      <StopButton value='STOP' onClick={handleStopButton} />
      {props.pincode.length && <CorrectButton value='CORR' onClick={handleCorrectButton} />}
      {props.pincode.length === 4 && <ConfirmButton value='OK' disabled onClick={handleConfirmButton} />}
    </StyledButtonbar>
  );
}

/*****************************
// Simulator
******************************/

const DEVICE_STATES = {
  STARTING: 'STARTING',
  ACCEPTING_TRANSACTION: 'ACCEPTING_TRANSACTION',
  OUT_OF_ORDER: 'OUT_OF_ORDER',
  IDLE: 'IDLE',
  RUNNING: 'RUNNING'
};

const TRANSACTION_STATES = {
  IDLE: 'IDLE',
  PRESENT_CARD: 'PRESENT_CARD',
  PIN_ENTER: 'PIN_ENTER',
  PIN_CONFIRM: 'PIN_CONFIRM',
  PIN_VERIFY: 'PIN_VERIFY',
  PIN_VALID: 'PIN_VALID',
  PIN_INVALID: 'PIN_INVALID',
  PIN_BLOCKED: 'PIN_BLOCKED',
  PROCESSING: 'PROCESSING',
  FINISHED: 'FINISHED'
};

const TRANSACTION_RESULTS = {
  APPROVED: 'APPROVED',
  FAILED: 'FAILED',
  DECLINED: 'DECLINED',
  STOPPED: 'STOPPED',
  TIMED_OUT: 'TIMED_OUT'
};

// time outs in milli-seconds
const TIMEOUTS = {
  PRESENT_CARD: 2000,
  PIN_ENTER: 30000,
  PIN_VERIFY: 2000,
  PIN_INVALID: 2000,
  PIN_VALID: 2000,
  PROCESSING: 2000,
  FINISHED: 4000
};

const StyledSimulator = styled.div`
  width: 300px;
  height: 600px;
  border: 1px solid black;

  position: absolute;
  top: 25px;
  left: 50px;
  user-select: none;
`;

function Simulator () {
  const [deviceState, setDeviceState] = useState(DEVICE_STATES.IDLE);
  const [transactionState, setTransactionState] = useState(TRANSACTION_STATES.IDLE);
  const [pincode, setPincode] = useState('');
  const pincodeRetries = useRef(3);
  const amount = useRef();
  const transactionResult = useRef();
  const [locale, setLocale] = useState('nl-NL');
  const [currency, setCurrency] = useState('EUR');

  // some buttons in the title bar for testing only
  const handleTitlebarLeft = useCallback((e) => {
    e.stopPropagation();
    if (transactionState === TRANSACTION_STATES.IDLE && deviceState === DEVICE_STATES.IDLE) {
      setTransactionState('PRESENT_CARD');
      amount.current = 2250;
      setDeviceState(DEVICE_STATES.RUNNING);
    }
  }, [transactionState, deviceState]);

  const handleTitlebarMiddle = useCallback((e) => {
    e.stopPropagation();
    if (deviceState === DEVICE_STATES.IDLE || deviceState === DEVICE_STATES.OUT_OF_ORDER) {
      if (deviceState === DEVICE_STATES.IDLE) {
        setDeviceState(DEVICE_STATES.OUT_OF_ORDER);
        if (locale === 'nl-NL') {
          setLocale('en-US');
          setCurrency('USD');
        } else {
          setLocale('nl-NL');
          setCurrency('EUR');
        }
      } else {
        setDeviceState(DEVICE_STATES.IDLE);
      }
    }
  }, [deviceState, locale]);

  const handleTitlebarRight = useCallback((e) => {
    e.stopPropagation();
    if (transactionState === TRANSACTION_STATES.IDLE && deviceState === DEVICE_STATES.IDLE) {
      setTransactionState('PRESENT_CARD');
      amount.current = 175050;
      setDeviceState(DEVICE_STATES.RUNNING);
    }
  }, [transactionState, deviceState]);

  const handleStop = useCallback(() => {
    setTransactionState(TRANSACTION_STATES.FINISHED);
    transactionResult.current = TRANSACTION_RESULTS.STOPPED;
    setDeviceState(DEVICE_STATES.STOPPED);
  }, []);

  const handleConfirmPincode = useCallback(() => {
    setTransactionState(TRANSACTION_STATES.PIN_VERIFY);
    pincodeRetries.current = pincodeRetries.current - 1;
  }, []);

  const handleSetPincode = useCallback((code) => {
    if (code.length <= 4) {
      setPincode(code);
    }
    if (code.length === 4) {
      setTransactionState(TRANSACTION_STATES.PIN_CONFIRM);
    }
  }, []);

  const handleResetPincode = useCallback(() => {
    setPincode('');
    setTransactionState(TRANSACTION_STATES.PIN_ENTER);
  }, []);

  function verifyPincode (pincode) {
    switch (pincode) {
      case '1234':
        setTransactionState(TRANSACTION_STATES.PIN_VALID);
        transactionResult.current = TRANSACTION_RESULTS.APPROVED;
        break;
      case '1111':
        setTransactionState(TRANSACTION_STATES.PIN_VALID);
        transactionResult.current = TRANSACTION_RESULTS.FAILED;
        break;
      case '2222':
        setTransactionState(TRANSACTION_STATES.PIN_VALID);
        transactionResult.current = TRANSACTION_RESULTS.DECLINED;
        break;
      default:
        setTransactionState(TRANSACTION_STATES.PIN_INVALID);
        break;
    }
  }

  useEffect(() => {
    switch (transactionState) {
      case TRANSACTION_STATES.IDLE:
        pincodeRetries.current = 3;
        break;
      case TRANSACTION_STATES.PRESENT_CARD:
      {
        const presentTimer = setTimeout(() => {
          if (amount.current >= 5000) {
            setTransactionState(TRANSACTION_STATES.PIN_ENTER);
          } else {
            transactionResult.current = TRANSACTION_RESULTS.APPROVED;
            setTransactionState(TRANSACTION_STATES.PROCESSING);
          }
        }, TIMEOUTS.PRESENT_CARD);
        return () => clearTimeout(presentTimer);
      }
      case TRANSACTION_STATES.PIN_ENTER:
      {
        const pinTimer = setTimeout(() => {
          setTransactionState(TRANSACTION_STATES.FINISHED);
          transactionResult.current = TRANSACTION_RESULTS.TIMED_OUT;
          setDeviceState(DEVICE_STATES.TIMED_OUT);
        }, TIMEOUTS.PIN_ENTER);
        return () => clearTimeout(pinTimer);
      }
      case TRANSACTION_STATES.PIN_CONFIRM:
        break;
      case TRANSACTION_STATES.PIN_VERIFY:
      {
        const verifyTimer = setTimeout(() => {
          verifyPincode(pincode);
        }, TIMEOUTS.PIN_VERIFY);
        return () => clearTimeout(verifyTimer);
      }
      case TRANSACTION_STATES.PIN_VALID:
      {
        const processingTimer = setTimeout(() => {
          setTransactionState(TRANSACTION_STATES.PROCESSING);
        }, TIMEOUTS.PIN_VALID);
        return () => clearTimeout(processingTimer);
      }
      case TRANSACTION_STATES.PIN_INVALID:
        setPincode('');
        {
          const processingTimer = setTimeout(() => {
            if (pincodeRetries.current === 0) {
              transactionResult.current = TRANSACTION_RESULTS.FAILED;
              setTransactionState(TRANSACTION_STATES.FINISHED);
            } else {
              setTransactionState(TRANSACTION_STATES.PIN_ENTER);
            }
          }, TIMEOUTS.PIN_INVALID);
          return () => clearTimeout(processingTimer);
        }
      case TRANSACTION_STATES.PROCESSING:
      {
        const processingTimer = setTimeout(() => {
          setTransactionState(TRANSACTION_STATES.FINISHED);
        }, TIMEOUTS.PROCESSING);
        return () => clearTimeout(processingTimer);
      }
      case TRANSACTION_STATES.FINISHED:
      {
        const finishedTimer = setTimeout(() => {
          amount.current = 0;
          setPincode('');
          setTransactionState(TRANSACTION_STATES.IDLE);
          setDeviceState(DEVICE_STATES.IDLE);
        }, TIMEOUTS.FINISHED);
        return () => clearTimeout(finishedTimer);
      }
      default:
        break;
    }
  }, [transactionState, deviceState]);

  return (
    <StyledSimulator>
      <Titlebar onClickLeft={handleTitlebarLeft} onClickMiddle={handleTitlebarMiddle} onClickRight={handleTitlebarRight} />
      {/* {Instruction} */}
      {(transactionState === TRANSACTION_STATES.PRESENT_CARD || transactionState === TRANSACTION_STATES.PIN_ENTER || transactionState === TRANSACTION_STATES.PIN_CONFIRM) && (<Instruction transactionState={transactionState} locale={locale} />)}
      {/* {Message} */}
      {!(transactionState === TRANSACTION_STATES.PIN_ENTER || transactionState === TRANSACTION_STATES.PIN_CONFIRM) && (<Message transactionState={transactionState} deviceState={deviceState} locale={locale} transactionResult={transactionResult.current} pincodeRetries={pincodeRetries.current} />)}
      {/* {Amount} */}
      {(transactionState === TRANSACTION_STATES.PRESENT_CARD || transactionState === TRANSACTION_STATES.PIN_ENTER || transactionState === TRANSACTION_STATES.PIN_CONFIRM) && (<Amount amount={amount.current} currency={currency} locale={locale} />)}
      {/* {Pincode + keypad} */}
      {(transactionState === TRANSACTION_STATES.PIN_ENTER || transactionState === TRANSACTION_STATES.PIN_CONFIRM) &&
        (<div><Pincode pincode={pincode} /><Keypad onHandlePincode={handleSetPincode} pincode={pincode} /></div>)}
      {/* {Buttons} */}
      {(transactionState === TRANSACTION_STATES.PRESENT_CARD || transactionState === TRANSACTION_STATES.PIN_ENTER || transactionState === TRANSACTION_STATES.PIN_CONFIRM) &&
        <Buttonbar pincode={pincode} onResetPincode={handleResetPincode} onStop={handleStop} onConfirm={handleConfirmPincode} />}
    </StyledSimulator>
  );
}

export { Simulator };
