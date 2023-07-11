import { Response, Request, NextFunction } from 'express';
import crypto from 'crypto';

type PaymentState = {
  setState: string;
  currentState: string;
  amount: number;
  terminalId: string;
  amountPaid: number;
  transactionId: string;
  receipt: string | null;
};

const PaymentData: PaymentState = {
  setState: '',
  currentState: 'idle',
  amount: 0,
  terminalId: '',
  amountPaid: 0,
  transactionId: '',
  receipt: null,
};

const resetPaymentState = () => {
  console.log('Resetting payment state');
  console.log(PaymentData.currentState);
  setTimeout(()=>{
    Object.assign(PaymentData, {
      setState: '',
      currentState: 'idle',
      amount: 0,
      terminalId: '',
      amountPaid: 0,
      transactionId: '',
      receipt: null
    });
  }, 5000)
};

const checkPaymentStatus = () => {
  const timeout = 20000;
  const startTime = Date.now();
  let intervalId: NodeJS.Timeout;

  intervalId = setInterval(() => {
    console.log(PaymentData.currentState);
    switch (PaymentData.setState) {
      case 'running':
        console.log('Payment state: running');
        PaymentData.currentState = 'Running';
        if (Date.now() - startTime >= timeout) {
          clearInterval(intervalId);
          Object.assign(PaymentData, {
            setState: 'timedout',
            currentState: 'Timed out',
            receipt: 'Transaction timed-out.',
          });
          resetPaymentState();
        } else if (Date.now() - startTime >= 5000) {
          if (PaymentData.amount === 100) {
            PaymentData.setState = 'finished';
          } else if (PaymentData.amount === 200) {
            PaymentData.setState = 'stopped';
          }
        }
        break;
      case 'finished':
        clearInterval(intervalId);
        Object.assign(PaymentData, {
          currentState: 'Finished',
          receipt: 'You have paid.',
          amountPaid: PaymentData.amount,
          setState: ''
        });
        resetPaymentState();
        break;
      case 'stopped':
        clearInterval(intervalId);
        Object.assign(PaymentData, {
          currentState: 'Stopped',
          receipt: 'Transaction stopped.',
          amountPaid: 0,
          setState: ''
        });
        resetPaymentState();
        break;
      default:
        console.log('Unknown payment state');
        resetPaymentState();
        break;
    }
  }, 1000);
};


const isIdle = (req: Request, res: Response, next: NextFunction) => {
  if (PaymentData.currentState !== 'idle') {
    return res.status(409).send('Another payment is already in progress.');
  }
  next();
};

const validatePaymentPostRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount } = req.body;
  if (amount === undefined || amount === null || isNaN(amount)) {
    return res
      .status(400)
      .send('Please provide a valid numeric amount for the payment.');
  }
  if (amount === 0) {
    return res
      .status(400)
      .send('Please provide a non-zero amount for the payment.');
  }
  next();
};

const startPaymentSequence = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { terminalId } = req.params;
  const { amount } = req.body;
  PaymentData.terminalId = terminalId;
  PaymentData.amount = amount;
  PaymentData.transactionId = crypto.randomBytes(8).toString('hex');
  PaymentData.setState = 'running';
  checkPaymentStatus();
  next();
};

const validatePaymentGetRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { terminalId, transactionId } = req.params;

  if (
    transactionId !== PaymentData.transactionId ||
    // deze nog even in een andere if statement zitten.
    terminalId !== PaymentData.terminalId
  ) {
    return res.status(404).send('Transaction not found');
  }
  next();
};

export {
  isIdle,
  PaymentData,
  validatePaymentPostRequest,
  validatePaymentGetRequest,
  checkPaymentStatus,
  startPaymentSequence,
};