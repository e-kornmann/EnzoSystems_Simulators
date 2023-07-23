import { useEffect, useState } from 'react';
import PaymentDevice from './components/simulators/PaymentDevice';
import FocusLock from "react-focus-lock";
import OtherDevice from './components/simulators/OtherDevice';
import { useModal } from './hooks/useModal';
import { DraggableModal } from './components/shared/DraggableModal/Modal';
import './style.css'
import { DndContext } from '@dnd-kit/core';
import useLogOn  from './hooks/useLogOn';
import * as S from './App.style';
import createTransaction from './utils/createTransaction';
import { GetTransactionDetails } from './components/simulators/PaymentDevice/types';
import { getTransaction, initialReceipt } from './utils/getTransaction';
import stopTransaction from './utils/stopTransactionHost';
import { hostCredentials, reqBody } from './config';

function App() {
  const { isShown, toggle } = useModal();
  const { token, logOn } = useLogOn(hostCredentials, reqBody);
  const [ amountToAsk, setAmountToAsk ] = useState('0');
  const [ isActive, setIsActive] = useState(false);
  const [ transactionIdApp, setTransactionIdApp ] = useState('');
  const [transactionDetails, setTransactionDetails] = useState<GetTransactionDetails>(initialReceipt);
  

  // const { terminalId, merchantId, reference, amountToPay, amountPaid, currency, locale, receipt, status } = transactionDetails    

  
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (init === false) {
      const doLogOn = async () => {
        const logOnSucceeded = await logOn();
        setInit(logOnSucceeded); 
      };
      setTimeout(() => doLogOn(), 1500);
    }
  }, [logOn, init]);

  
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




  const [simulators, setSimulators] = useState({
    paymentDevice: false,
    otherDevice: false,
  });


  const reset = () => {
    setAmountToAsk('');
    setTransactionIdApp('');
    setTransactionDetails(initialReceipt)
  };




  const showSimulatorHandler = (simulator: string) => {
    setSimulators((prevSimulators) => ({
      ...Object.keys(prevSimulators).reduce((acc, key) => {
        return {
          ...acc,
          [key]: key === simulator, // Set the selected simulator to true, others to false
        };
      }, {} as { paymentDevice: boolean; otherDevice: boolean }), // Specify the return type
    }));
    toggle();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmountToAsk(e.target.value);
  }

  console.log(isActive);
   console.log(transactionDetails);
   console.log(`this is : ${transactionIdApp}`)
   const transIdMessage = isActive ? `${transactionIdApp}` : null;    
  
   return (
   <>
        <S.ConnectMessage $init={init}>{import.meta.env.VITE_HOST_ID} { init ? 'is logged in to the Enzo Pay API' : 'has to be loggin to the Enzo Pay API to create a transaction'}</S.ConnectMessage>
          <DndContext>
        <S.ButtonModalContainer>
          <S.Button onClick={() => showSimulatorHandler('paymentDevice')}>Open payment modal</S.Button>
          <S.Button onClick={() => showSimulatorHandler('otherDevice')}>Other Device</S.Button>
         { 
          
          (simulators.paymentDevice && isShown) 
              && 
              <>
              <S.FocusContainer>

                  <FocusLock>
                 <S.BlinkingDot $isActive={isActive}/> <S.StatusText>{transactionDetails.status}</S.StatusText>
                  <S.PayBillContainer>
                    <S.StyledLable htmlFor='amount'>€</S.StyledLable>
                    <S.InputAmount id="amount" value={amountToAsk} type="number" onChange={handleChange} />
                    <S.AmountText>{ transIdMessage }</S.AmountText>
                    <S.StopButton onClick={() => stopTransaction(token, transactionIdApp, setIsActive, reset)} > Stop</S.StopButton>
                    <S.OkButton onClick={() => createTransaction(token, amountToAsk, setTransactionIdApp)} > OK</S.OkButton>
                    </S.PayBillContainer> 
                  </FocusLock>
                </S.FocusContainer>      
                

{/*              
  <div>
    <div>terminalId: {terminalId}</div>
    <div>merchantId: {merchantId}</div>
    <div>reference: {reference}</div>
    <div>amountToPay: {amountToPay}</div>
    <div>amountPaid: {amountPaid}</div>
    <div>currency: {currency}</div>
    <div>locale: {locale}</div>
    <div>receipt: {receipt}</div>
    <div>status: {status}</div>
  </div> */}

              </>

          }
         
        </S.ButtonModalContainer>
      

        <DraggableModal
         isShown={isShown}
         hide={toggle}
         headerText={simulators.paymentDevice ? "Payment Device" : "Other Device"}
         modalContent={simulators.paymentDevice ? <PaymentDevice isClosed={!simulators.paymentDevice} /> :  <OtherDevice /> }
         identifier={simulators.paymentDevice ? "Payment Device" : "Other Device"}
        />
       </DndContext>
       
     </>
  );
}

export default App;
