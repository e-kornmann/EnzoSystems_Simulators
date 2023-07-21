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
import useStopTransaction from './hooks/app/useStopTransaction';




function App() {
  const { isShown, toggle } = useModal();
  const { hostToken, logOn } = useLogOnHost();
  const [amountToPay, setAmountToPay] = useState(0);

    
  const [init, setInit] = useState(false);
  

  const [isStoppedTransaction, setIsStoppedTransaction] = useState(true);
    const { transactionIdApp, createTransaction } = useCreateTransaction(hostToken, amountToPay, setIsStoppedTransaction);
    const { stopTransaction } = useStopTransaction(hostToken, transactionIdApp, setIsStoppedTransaction);
  
  const [simulators, setSimulators] = useState({
    paymentDevice: false,
    otherDevice: false,
  });

  
  const displayCreatedTransaction = transactionIdApp ? 'pending transaction: ' + transactionIdApp : '';
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>)=> setAmountToPay(Number(e.target.value) / 10) 




  useEffect(() => {
    if (init === false) {
      if ( hostToken === '') {
        logOn();
        } else {
        setTimeout(()=>setInit(true), 2000)
    }
    
  }
}, [hostToken, logOn, init]) 


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

  
   const transIdMessage = isStoppedTransaction ? `${transactionIdApp} is stopped` : `${transactionIdApp} is running`;    
  
  
    return (


   <>
        <S.ConnectMessage $init={init}>{import.meta.env.VITE_HOST_ID} { init ? 'is logged in to the Enzo Pay API' : 'has to be loggin to the Enzo Pay API to create a transaction'}{displayCreatedTransaction}</S.ConnectMessage>
          <DndContext>
        <S.ButtonModalContainer>
          <S.Button onClick={() => showSimulatorHandler('paymentDevice')}>Open payment modal</S.Button>
          <S.Button onClick={() => showSimulatorHandler('otherDevice')}>Other Device</S.Button>

     
    
         { 
          
          (simulators.paymentDevice && isShown) 
              && 
              <S.FocusContainer>
                  <FocusLock>
                  <S.PayBillContainer>
                    <label htmlFor='amount'>Eur</label>
                    <S.InputAmount id="amount" type="number" onChange={handleChange} />
                    <S.AmountText>{ transactionIdApp !== '' ? transIdMessage : null }</S.AmountText>
                    <S.StopButton onClick={stopTransaction} > Stop</S.StopButton>
                    <S.OkButton onClick={createTransaction} > OK</S.OkButton>
                    </S.PayBillContainer> 
                  </FocusLock>
                </S.FocusContainer>
                
                  
                
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
