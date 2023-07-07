import Router, { Response, Request } from 'express';
const payment_terminal = Router();

payment_terminal.get('/', (_req: Request, res: Response) => res.send('This payment_terminal endpoint is ready to receive requests'));

const PaymentData = [
  {
    id: '123',
    amount: 1000, 
    transactionId: '1234'
  }
];
 
payment_terminal.post('/:terminalid/payment', async (req, res) => {
  const { terminalid } = req.params;
  const { terminalId, amount } =req.body;

  if (terminalid !== terminalId) {
    return res.status(400).send('Invalid terminal ID provided. Please provide the correct terminal ID.');
  }

  try {
    res.status(200).send('Payment successful');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred');
  }
});

export default payment_terminal;
