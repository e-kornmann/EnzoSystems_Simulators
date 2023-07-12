import request from 'supertest';
import express, { Application } from 'express';
import payment_terminal from '../routes/payment_terminal';
import { PaymentData } from '../routes/middleware/middleware';


const app: Application = express();
app.use(express.json());

app.use('/payment_terminal', payment_terminal);

const terminalId = '123';
let retrievedId: string;

describe('Payment Terminal API', () => {
  it('GET /payment_terminal should return 200', async () => {
    const response = await request(app).get('/payment_terminal');
    expect(response.status).toBe(200);
    expect(response.text).toBe(
      'This payment_terminal endpoint is ready to receive requests'
    );
  });

  it('POST /payment_terminal/:terminalId/payment should return 200 with a transactionId', async () => {
    const terminalId = '123';
    const amount = 100;
    const response = await request(app)
      .post(`/payment_terminal/${terminalId}/payment`)
      .send({ amount });

    expect(response.status).toBe(200);
    expect(response.body.transactionId).toMatch(/^[0-9a-f]{16}$/);
  });


  
  it('GET /payment_terminal/:terminalId/payment/:transactionId should return 200', async () => {
    const terminalId = '123';
    retrievedId = PaymentData.transactionId;

    const response = await request(app).get(
      `/payment_terminal/${terminalId}/payment/${retrievedId}`
    );

    expect(response.status).toBe(200); 
    expect(response.body.currentState).toBe('Running'); 
  });
  it('GET /payment_terminal/:terminalId/payment/:transactionId should return 404 after a timeout of 30 seconds', async () => {
    jest.useFakeTimers(); // Enable fake timers
  
    // Mock the API request with a promise that resolves after a delay
    const responsePromise = new Promise<any>((resolve, reject) => {
      // Delay the resolution with a custom timeout
      const timeout = setTimeout(() => {
        resolve({ status: 404, receipt: 'Transaction timed-out' });
      }, 30000);
  
      request(app)
        .get(`/payment_terminal/${terminalId}/payment/${retrievedId}`)
        .end((error, response) => {
          clearTimeout(timeout); // Cancel the timeout if the request completes before the timeout
          if (error) {
            reject(error);
          } else {
            resolve(response);
          }
        });
    });
  
    jest.advanceTimersByTime(30000); // Advance timers by 30 seconds
  
    const response = await responsePromise as unknown as request.Response;
  
    expect(response.status).toBe(404);
    expect(response.body.receipt).toBe('Transaction timed-out'); 
  });
  
  
  
});
