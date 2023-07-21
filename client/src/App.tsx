import { useEffect, useState } from 'react';
import PaymentDevice from './components/simulators/PaymentDevice';
import FocusLock from "react-focus-lock";
import OtherDevice from './components/simulators/OtherDevice';
import { useModal } from './hooks/terminal/useModal';
import { DraggableModal } from './components/shared/DraggableModal/Modal';
import './style.css'
import { DndContext } from '@dnd-kit/core';
import useLogOnHost  from './hooks/app/useLogOnHost';
import useCreateTransaction from './hooks/app/useCreateTransaction';
import * as S from './App.style';
import useStopTransactionHost from './hooks/app/useStopTransactionHost';
import useGetTransaction from './hooks/app/useGetTransaction';

function App() {
  const { isShown, toggle } = useModal();
  const { hostToken, logOn } = useLogOnHost();
  const [ amountToAsk, setAmountToAsk ] = useState('0');
  const [isStoppedTransaction, setIsStoppedTransaction] = useState(true);
  const { transactionIdApp, createTransaction } = useCreateTransaction(hostToken, amountToAsk, setIsStoppedTransaction);
  const { stopTransaction } = useStopTransactionHost(hostToken, transactionIdApp, setIsStoppedTransaction);
  const { transactionDetails, getTransaction } = useGetTransaction(hostToken,  transactionIdApp);
  // const { terminalId, merchantId, reference, amountToPay, amountPaid, currency, locale, receipt, status } = transactionDetails    
  const [init, setInit] = useState(false);

  useEffect(() => {
    if (init === false) {
      if ( hostToken === '') {
        logOn();
        } else {
        setTimeout(()=>setInit(true), 2000)
    }
  }
}, [hostToken, logOn, init]) 

useEffect(() => {
  const interval = setInterval(getTransaction, 3000);
    if (transactionDetails.status !== 'RUNNING') {
      setIsStoppedTransaction(true);
    } 
    console.log('Terminal: ' + transactionDetails.status);

  return () => {
    clearInterval(interval);
  };
}, [getTransaction, transactionDetails, transactionIdApp]);

  const [simulators, setSimulators] = useState({
    paymentDevice: false,
    otherDevice: false,
  });
  const resetAmount = () => {
    setAmountToAsk('0');
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
  
   const transIdMessage = isStoppedTransaction ? `${transactionIdApp} is stopped` : `${transactionIdApp} is running`;    
  
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
                    <S.BlinkingDot $isRunning={!isStoppedTransaction} />
                  <FocusLock>
                  <S.PayBillContainer>
                    <S.StyledLable htmlFor='amount'>€</S.StyledLable>
                    <S.InputAmount id="amount" value={amountToAsk} type="number" onChange={handleChange} />
                    <S.AmountText>{ transactionIdApp !== '' ? transIdMessage : null }</S.AmountText>
                    <S.StopButton onClick={() => { resetAmount(); stopTransaction(); }} > Stop</S.StopButton>
                    <S.OkButton onClick={createTransaction} > OK</S.OkButton>
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
