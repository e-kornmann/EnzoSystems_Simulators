import Router, { Response, Request } from 'express';
import crypto from 'crypto';
import { validatePaymentRequest, isIdle } from './middleware/validation';

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

console.log(PaymentData);

payment_terminal.post('/:terminalId/payment', isIdle, validatePaymentRequest,
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

payment_terminal.get('/:terminalId/payment/:transactionId', async (req, res) => {
  const { terminalId, transactionId } = req.params;

  if (transactionId !== PaymentData.transactionId || terminalId !== PaymentData.terminalId) {
    return res.status(404).send('Transaction not found');
  }

  const timeout = 30000; // Timeout in milliseconds (e.g., 30 seconds)
  const startTime = Date.now();

  while (PaymentData.state === 'running' && (Date.now() - startTime) < timeout) {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking the state again
  }

  if (PaymentData.state === 'finished') {
    return res.status(200).json({
      state: PaymentData.state,
      amountPaid: PaymentData.amountPaid,
      receipt: 'You have paid',
    });
  } else if (PaymentData.state === 'stopped') {
    return res.status(200).json({
      state: PaymentData.state,
      amountPaid: PaymentData.amountPaid,
      receipt: 'Transaction stopped',
    });
  } else if (PaymentData.state === 'timedout') {
    return res.status(200).json({
      state: PaymentData.state,
      amountPaid: PaymentData.amountPaid,
      receipt: 'Transaction timed-out',
    });
  } else {
    return res.status(500).send('An error occurred');
  }
});


export default payment_terminal;
