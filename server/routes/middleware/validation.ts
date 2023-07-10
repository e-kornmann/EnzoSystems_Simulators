import { Response, Request, NextFunction } from 'express';
import { PaymentData } from '../payment_terminal';

const isIdle = (req: Request, res: Response, next: NextFunction) => {
    
    if (PaymentData.state !== 'idle') {
         return res
           .status(400)
           .send('Another payment is already in progress.');
     }
    next();
   }
 
 
const validatePaymentPostRequest = (req: Request, res: Response, next: NextFunction) => {
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
  }

  const validatePaymentGetRequest = async (req: Request, res: Response, next: NextFunction) => {
    const { terminalId, transactionId } = req.params;
  
    if (transactionId !== PaymentData.transactionId || terminalId !== PaymentData.terminalId) {
      return res
        .status(404)
        .send('Transaction not found');
    }
    next();
  };



  const checkPaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
    const timeout = 30000;
    const startTime = Date.now();
  
    const intervalId = setInterval(() => {
      switch (PaymentData.state) {
        case 'running':
          if ((Date.now() - startTime) >= timeout) {
            clearInterval(intervalId);
            req.body = {
              state: 'timedout',
              amountPaid: PaymentData.amountPaid,
              receipt: 'Transaction timed-out',
            };
            next();
          }
          break;
        case 'finished':
          clearInterval(intervalId);
          req.body = {
            state: PaymentData.state,
            amountPaid: PaymentData.amountPaid,
            receipt: 'You have paid',
          };
          next();
          break;
        case 'stopped':
          clearInterval(intervalId);
          req.body = {
            state: PaymentData.state,
            amountPaid: PaymentData.amountPaid,
            receipt: 'Transaction stopped',
          };
          next();
          break;
        default:
          clearInterval(intervalId);
          return res.status(500).send('An error occurred');
      }
    }, 1000);
  };
  
  export { isIdle, validatePaymentPostRequest, validatePaymentGetRequest, checkPaymentStatus };







