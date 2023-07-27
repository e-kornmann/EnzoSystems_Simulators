import styled from 'styled-components';
import * as Sv from '../../../styles/stylevariables';
import Example3 from './input';
import * as S from '../../../styles/App.style';
import { useState, useEffect } from 'react';
import createTransaction from '../../../utils/createTransaction';
import { initialReceipt, getTransaction } from '../../../utils/getTransaction';
import stopTransaction from '../../../utils/stopTransactionHost';
import { GetTransactionDetails } from '../PaymentDevice/types';
import { hostCredentials } from '../../../App.config';
import useLogOn from '../../../hooks/useLogOn';

import { reqBody } from '../PaymentDevice/config';

const Container = styled.main`
background-color: white;
font-family: 'Inter', sans-serif;
display: grid;
width: 560px;
height: 360px;
column-gap: 15px;
grid-template-rows: 60px 300px;
border-radius: 10px;
`;

const Header = styled.div`
grid-row: 1 / 2;
display: flex;
justify-content: center;
align-items: center;
font-size: 20px;
color: ${Sv.enzoOrange};
font-weight: 500;
border-top-left-radius: 5px;
border-top-right-radius: 5px;
`;

const TextBox = styled.div`
grid-row: 2 / 3;
padding: 12px 15px;
display: flex;
justify-content: center;
align-items: center;
font-size: 25px;
background-color: #F7F7F7;
border-bottom-left-radius: 5px;
border-bottom-right-radius: 5px;
`;
const OtherDevice = () => {

  const [init, setInit] = useState(false);

  const { token, logOn } = useLogOn(hostCredentials, reqBody);






  const [ amountToAsk, setAmountToAsk ] = useState('0');
  const [ isActive, setIsActive] = useState(false);
  const [ transactionIdApp, setTransactionIdApp ] = useState('');
  const [transactionDetails, setTransactionDetails] = useState<GetTransactionDetails>(initialReceipt);
  


  useEffect(() => {
    if (init === false) {
       const doLogOn = async () => {
        const logOnSucceeded = await logOn();
        setInit(logOnSucceeded);
      };
      doLogOn();
    }
  }, [init, logOn]);


  useEffect(() => {
    if (transactionIdApp !== '' && token !== '') {
      const interval = setInterval(() => {
        getTransaction(token, transactionIdApp, setTransactionDetails);
      }, 3000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [token, transactionIdApp]);

  


   useEffect(() => {
    if (
      transactionIdApp !== '' &&
      (transactionDetails.status !== 'FAILED' && 
      transactionDetails.status !== 'STOPPED' &&
      transactionDetails.status !== 'TIMEDOUT' &&
      transactionDetails.status !== 'DECLINED' &&
      transactionDetails.status !== 'FINISHED')
    ) {
      setTimeout(() => setIsActive(true), 2000);
    } else {
      setTimeout(() => {
        reset();
        setIsActive(false);
      }, 2000);
    }
  }, [isActive, transactionDetails, transactionIdApp]);



  const reset = () => {
    setAmountToAsk('');
    setTransactionIdApp('');
    setTransactionDetails(initialReceipt)
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountToAsk(e.target.value);
  }

   const transIdMessage = isActive ? `${transactionIdApp}` : null;    














  return (
    <Container>
        <Header>Other Device</Header>
        <TextBox>
          
        <S.FocusContainer>

                 <S.BlinkingDot $isActive={isActive}/> <S.StatusText>{transactionDetails.status}</S.StatusText>
                  <S.PayBillContainer>
                    <S.StyledLable htmlFor='amount'>€</S.StyledLable>
                    <S.InputAmount id="amount" value={amountToAsk} type="number" onChange={handleChange} />
                    <S.AmountText>{ transIdMessage }</S.AmountText>
                    <S.StopButton onClick={() => stopTransaction(token, transactionIdApp, setIsActive, reset)} > Stop</S.StopButton>
                    <S.OkButton onClick={() => createTransaction(token, amountToAsk, setTransactionIdApp)} > OK</S.OkButton>
                    </S.PayBillContainer> 
         
                </S.FocusContainer>      
           


        </TextBox>
        <Example3 />
        <S.ConnectMessage $init={init}>{import.meta.env.VITE_HOST_ID} { init ? 'is logged in to the Enzo Pay API' : 'has to be loggin to the Enzo Pay API to create a transaction'}</S.ConnectMessage>
    </Container>
  );
};

export default OtherDevice;







