import { useCallback, useState } from 'react';
import PaymentDevice from './components/simulators/PaymentDevice';
import OtherDevice from './components/simulators/OtherDevice';
import { DraggableModal } from './components/shared/DraggableModal/Modal';
import './styles/style.css'
import { DndContext } from '@dnd-kit/core';
import  * as S from './styles/App.style';



function App() {

  type SimulatorsType = {
    paymentDevice: boolean;
    otherDevice: boolean;
  };

  const [simulators, setSimulators] = useState<SimulatorsType>({
    paymentDevice: true,
    otherDevice: true,
  });


  const showSimulatorHandler = useCallback((simulator: keyof SimulatorsType) => {
    setSimulators((prevSimulators) => ({
      ...prevSimulators,
      [simulator]: !prevSimulators[simulator],
    }));
  }, []);

  




  

  
   return (
   <>
       
       <S.OpenModalButtonsContainer>
          <S.OpenModelButton onClick={() => showSimulatorHandler('paymentDevice')} $isActive={simulators.paymentDevice}>Open payment modal</S.OpenModelButton>
          <S.OpenModelButton onClick={() => showSimulatorHandler('otherDevice')} $isActive={simulators.otherDevice}>Demo app</S.OpenModelButton>
        </S.OpenModalButtonsContainer>

          <DndContext>

      

        <DraggableModal
         isShown={simulators.paymentDevice}
         hide={() => showSimulatorHandler('paymentDevice')}
         headerText=""
         modalContent={<PaymentDevice />}
         identifier={"Payment Device"}
        />
         <DraggableModal
         isShown={simulators.otherDevice}
         hide={() => showSimulatorHandler('otherDevice')}
         headerText=""
         modalContent={<OtherDevice />}
         identifier={"Other Device"}
        />
       </DndContext>

     </>
  );
}

export default App;
