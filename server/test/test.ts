import { Application } from 'express';
import request, { Request, Response } from 'supertest';
import payment_terminal  from '../routes/payment_terminal';



describe('Payment Terminal API', () => {
    describe('GET /', () => {
      it.only('should return a success message', async () => {
        const response = await request(payment_terminal).get('/');
        expect(response.statusCode).toEqual(200);
        expect(response.text).toBe('This payment_terminal endpoint is ready to receive requests');
      });
    });
  
    describe('POST /:terminalId/payment', () => {
      it.only('should return 200 & valid response if terminalId param is set and got the right body', done => {
        const terminalId = '123';
        const amount = 100;
        request(payment_terminal)
          .post(`/${terminalId}/payment`)
          .send({ amount })
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(res => {
            expect(res.body.transactionId).toMatch(/^[0-9a-f]{16}$/);
          })
          .end(done);
      
        });
      });
    });
  
    
   
    
    
     
        // PaymentData.state = 'running';
        // PaymentData.amountPaid = 0;
        // PaymentData.transactionId = response.body.transactionId;
        // expect(response.body).toEqual({
        //   state: 'running',
        //   amount: amount,
        //   terminalId: terminalId,
        //   amountPaid: 0,
        //   transactionId: expect.any(String),
        //   receipt: null,

        
        
        // it('should not allow another payment when not in idle', async () => {
        //     const terminalId = '123';
        //     const amount = 100;
        
        //     const response = await request(payment_terminal)
        //       .post(`/${terminalId}/payment`)
        //       .send({ amount });
        
                 
          
        //     expect(response.status).toBe(400);
         
         
        //   });



    

    

    