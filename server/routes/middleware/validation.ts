import { Response, Request, NextFunction } from 'express';
import { PaymentData } from '../payment_terminal';

const isIdle = (req: Request, res: Response, next: NextFunction) => {
    
    if (PaymentData.state !== 'idle') {
         return res.status(400).send('Another payment is already in progress.');
     }
    next();
   }
 
 
const validatePaymentRequest = (req: Request, res: Response, next: NextFunction) => {
    const { amount } = req.body;   
    if (amount === undefined || amount === null || isNaN(amount)) {
      return res.status(400).send('Please provide a valid numeric amount for the payment.');
    }
    if (amount === 0) {
      return res.status(400).send('Please provide a non-zero amount for the payment.');
    }
    next();
  }


export { isIdle,validatePaymentRequest } ;






