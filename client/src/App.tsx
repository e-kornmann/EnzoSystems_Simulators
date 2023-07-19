import { useEffect, useState } from 'react';
import PaymentDevice from './components/simulators/PaymentDevice';
import OtherDevice from './components/simulators/OtherDevice';
import { useModal } from './hooks/terminal/useModal';
import { DraggableModal } from './components/shared/DraggableModal/Modal';
import './style.css'
import { DndContext } from '@dnd-kit/core';
import { Button } from './components/shared/buttons';
import styled from 'styled-components';
import useLogOnHost  from './hooks/app/useLogOnHost';
import * as Sv from './components/shared/stylevariables';
import useCreateTransaction from './hooks/app/useCreateTransaction';


const ButtonModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  padding: 40px;
`;



const ConnectMessage = styled.header<{ $init: boolean }>`
  font-size: 14px;
  font-weight: 600;
  padding: 10px;
  background-color: ${(props) => (props.$init ? Sv.green : Sv.red)};
  color: white;
  text-align: center;
`


function App() {
  const { isShown, toggle } = useModal();
  const { hostToken, logOn } = useLogOnHost();
  const [init, setInit] = useState(false);
  // check met Erik ff de benaming;
  const { transactionIdApp, createTransaction } = useCreateTransaction(hostToken);
  
  const [simulators, setSimulators] = useState({
    paymentDevice: false,
    otherDevice: false,
  });


  useEffect(() => {
    if (!init) {
      logOn();
      setInit(true);
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
  
  return (
     <> 
        <ConnectMessage $init={init}>{import.meta.env.VITE_HOST_ID} { init ? 'is logged in to the Enzo Pay API' : 'has to be loggin to the Enzo Pay API to create a transaction'}</ConnectMessage>
       <DndContext>
        <ButtonModalContainer>
        
         <Button onClick={() => showSimulatorHandler('paymentDevice')}>Open payment modal</Button>
         <Button onClick={() => showSimulatorHandler('otherDevice')}>Other Device</Button>
        </ButtonModalContainer>
       <DraggableModal
         isShown={isShown}
         hide={toggle}
         headerText={simulators.paymentDevice ? "Payment Device" : "Other Device"}
         modalContent={simulators.paymentDevice ? <PaymentDevice /> :  <OtherDevice /> }
         identifier={simulators.paymentDevice ? "Payment Device" : "Other Device"}
        />
       </DndContext>
     </>
  );
}

export default App;
