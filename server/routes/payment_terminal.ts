import Router, { Response, Request } from 'express';
import crypto from 'crypto';
import { validatePaymentPostRequest, validatePaymentGetRequest, isIdle, checkPaymentStatus } from './middleware/validation';

const payment_terminal = Router();

payment_terminal.get('/', (_req: Request, res: Response) =>
  res.send('This payment_terminal endpoint is ready to receive requests')
);

export const PaymentData = {
  state: 'idle',
  amount: 0,
  terminalId: '',
  amountPaid: 0,
  transactionId: '',
  receipt: null,
};

payment_terminal.post('/:terminalId/payment', isIdle, validatePaymentPostRequest,
  async (req: Request, res: Response) => {
    const { terminalId } = req.params;
    const { amount } = req.body;
    PaymentData.terminalId = terminalId;
    PaymentData.amount = amount;
    PaymentData.transactionId = crypto.randomBytes(8).toString('hex');
    PaymentData.state = 'running';
    PaymentData.amountPaid = 0;
    PaymentData.receipt = null;
    try {
      res.status(200).json(PaymentData);
    } catch (error) {
      console.error(error);
      res.status(500).send('An error occurred');
    }
  }
);

payment_terminal.get('/:terminalId/payment/:transactionId', validatePaymentGetRequest, checkPaymentStatus, 
  async (req: Request, res: Response) => {
    res.status(200).json(req.body);
  });

export default payment_terminal;
