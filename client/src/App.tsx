import { useState } from 'react';
import PaymentDevice from './components/simulators/PaymentDevice';
import OtherDevice from './components/simulators/OtherDevice';
import { useModal } from './hooks/useModal';
import { DraggableModal } from './components/shared/DraggableModal/Modal';
import './style.css'
import { DndContext } from '@dnd-kit/core';
import { Button } from './components/shared/buttons';
import styled from 'styled-components';


const ButtonModalContainer = styled.div`
display: flex;
flex-direction: column;
row-gap: 15px;
padding: 40px;
`;


function App() {
  const { isShown, toggle } = useModal();
  const [simulators, setSimulators] = useState({
    paymentDevice: false,
    otherDevice: false,
  });



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


