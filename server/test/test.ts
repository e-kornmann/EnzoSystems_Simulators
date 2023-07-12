import request from 'supertest';
import express, { Application } from 'express';
import payment_terminal from '../routes/payment_terminal';
import { PaymentData } from '../routes/middleware/middleware';


const app: Application = express();
app.use(express.json());

app.use('/payment_terminal', payment_terminal);

const terminalId = '123';
const amount = 1000;
let retrievedTransactionId: string;

describe('Payment Terminal API', () => {
  it.only('GET /payment_terminal should return 200', async () => {
    const response = await request(app).get('/payment_terminal');
    expect(response.status).toBe(200);
    expect(response.text).toMatch(/This payment_terminal endpoint is ready to receive requests/);
  });
});

describe('POST /payment_terminal/:terminalId/payment', () => {
  it('should return 200 with a transactionId', async () => {
    const response = await request(app)
      .post(`/payment_terminal/${terminalId}/payment`)
      .send({ amount });
    expect(response.status).toBe(200);
    expect(response.body.transactionId).toMatch(/^[0-9a-f]{16}$/);
  });
});

describe('GET /payment_terminal/:terminalId/payment/:transactionId', () => {
  it('should return 200', async () => {
    retrievedTransactionId = PaymentData.transactionId;
    const response = await request(app).get(
      `/payment_terminal/${terminalId}/payment/${retrievedTransactionId}`
    );
    expect(response.status).toBe(200); 
    expect(response.body.currentState).toBe('Running'); 
  });

  it('should return 404 when wrong transactionId is given', async () => {
    const wrongTransactionsId = 'th1515wr0ng';
    const response = await request(app).get(
      `/payment_terminal/${terminalId}/payment/${wrongTransactionsId}`
    );
    expect(response.status).toBe(404); 
    expect(response.body.receipt).toBe('TransactionId not found'); 
  });
  
  it('should return 404 when wrong terminalId is given', async () => {
    const wrongterminalId = '12423';
    const response = await request(app).get(
      `/payment_terminal/${wrongterminalId}/payment/${retrievedTransactionId}`
    );
    expect(response.status).toBe(404); 
    expect(response.body.receipt).toBe('TerminalId not found'); 
  });

  jest.setTimeout(22600);
  it('should time out after 20 sec', async () => {
    await new Promise((r) => setTimeout(r, 20200));
    const response = await request(app).get(
      `/payment_terminal/${terminalId}/payment/${retrievedTransactionId}`
    );  
    expect(response.status).toBe(200);
    expect(response.body.receipt).toBe('Transaction timed-out.');
  });

  it('should ask for a new payment after 25 seconds', async () => {
    await new Promise((r) => setTimeout(r, 5000));
    const response = await request(app).get(
      `/payment_terminal/${terminalId}/payment/${retrievedTransactionId}`
    );  
    expect(response.status).toBe(404);
    expect(response.body.receipt).toBe('Please start another payment');
  });
});
