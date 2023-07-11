import Router, { Response, Request } from 'express';
import crypto from 'crypto';

import {
  validatePaymentPostRequest,
  validatePaymentGetRequest,
  isIdle,
  startPaymentSequence,
  PaymentData,
} from './middleware/middleware';

const payment_terminal = Router();

payment_terminal.get(
  '/',
  async (_req: Request, res: Response): Promise<Response> =>
    res
      .status(200)
      .send('This payment_terminal endpoint is ready to receive requests')
);

payment_terminal.post(
  '/:terminalId/payment',
  isIdle,
  validatePaymentPostRequest, 
  startPaymentSequence,
  async (req: Request, res: Response) => {
    try {
      res.status(200).json({ transactionId: PaymentData.transactionId });
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  }
);

payment_terminal.get(
  '/:terminalId/payment/:transactionId',
  validatePaymentGetRequest,
  async (req: Request, res: Response) => {
    res.status(200).json(PaymentData);
  }
);

export default payment_terminal;
