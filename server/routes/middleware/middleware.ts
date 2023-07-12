import { Response, Request, NextFunction } from 'express';
import crypto from 'crypto';

type PaymentState = {
  nextState: string;
  currentState: string;
  amount: number;
  terminalId: string;
  amountPaid: number;
  transactionId: string;
  receipt: string | null;
};

const PaymentData: PaymentState = {
  nextState: '',
  currentState: 'idle',
  amount: 0,
  terminalId: '',
  amountPaid: 0,
  transactionId: '',
  receipt: null,
};

const resetPaymentState = async () => {
  await new Promise<void>((resolve) => {
    setTimeout(() => {
      Object.assign(PaymentData, {
        nextState: '',
        currentState: 'idle',
        amount: 0,
        terminalId: '',
        amountPaid: 0,
        transactionId: '',
        receipt: null,
      });
      resolve();
    }, 3500);
  });
};

const checkPaymentStatus = async () => {
  const timeout = 20000;
  const startTime = Date.now();
  let intervalId: NodeJS.Timeout;

  intervalId = setInterval(async () => {
    switch (PaymentData.nextState) {
      case 'running':
        
        if (Date.now() - startTime >= timeout) {
          clearInterval(intervalId);
          Object.assign(PaymentData, {
            nextState: 'timedout',
            currentState: 'Timed out',
            receipt: 'Transaction timed-out.',
          })
          await resetPaymentState();
        
        } else if (Date.now() - startTime >= 5000) {
          if (PaymentData.amount === 100) {
            PaymentData.nextState = 'finished';
          } else if (PaymentData.amount === 200) {
            PaymentData.nextState = 'stopped';
          }
        }
        break;
      case 'finished':
        clearInterval(intervalId);
        Object.assign(PaymentData, {
          currentState: 'Finished',
          receipt: 'You have paid.',
          amountPaid: PaymentData.amount,
          nextState: '',
        });
        await resetPaymentState();
        break;
      case 'stopped':
        clearInterval(intervalId);
        Object.assign(PaymentData, {
          currentState: 'Stopped',
          receipt: 'Transaction stopped.',
          amountPaid: 0,
          nextState: '',
        });
        await resetPaymentState();
        break;
      default:
        await resetPaymentState();
        break;
    }
  }, 1000);
};

const isIdle = (req: Request, res: Response, next: NextFunction) => {
  if (PaymentData.currentState !== 'idle') {
    resetPaymentState().then(() => {
      res
        .status(409)
        .json({ message: 'Another payment is already in progress.' });
    });
  } else {
    next();
  }
};

const validatePaymentPostRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { amount } = req.body;
  if (amount === undefined || amount === null || isNaN(amount)) {
    resetPaymentState().then(() => {
      res
        .status(400)
        .json({ message: 'Please provide a valid numeric amount for the payment.' });
    });
  } else if (amount === 0) {
    resetPaymentState().then(() => {
      res
        .status(400)
        .json({ message: 'Please provide a non-zero amount for the payment.' });
    });
  } else {
    next();
  }
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
  PaymentData.nextState = 'running';
  PaymentData.currentState = 'Running';
  checkPaymentStatus().then(() => {
    next();
  });
};

const validatePaymentGetRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { terminalId, transactionId } = req.params;
  if ( PaymentData.currentState !== 'idle' && transactionId !== PaymentData.transactionId)
    res.status(404).json({ receipt: 'TransactionId not found' });
  if ( PaymentData.currentState !== 'idle' && terminalId !== PaymentData.terminalId)
    res.status(404).json({ receipt: 'TerminalId not found' });
  if ( PaymentData.currentState === 'idle' && PaymentData.terminalId === '' )
    res.status(404).json({ receipt: 'Please start another payment' });
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
