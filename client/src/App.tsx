import { useCallback, useState } from 'react';
import OtherDevice from './components/simulators/OtherDevice';
import { DraggableModal } from './components/shared/DraggableModal/Modal';
import './styles/style.css'
import { DndContext } from '@dnd-kit/core';
import * as S from './styles/App.style';
import { Simulator } from './components/simulators/PaymentDevice_Erik/simulator'
import PaymentTerminal from './components/simulators/PaymentDevice/PaymentTerminal';



function App() {
  type SimulatorsType = {
    paymentDevice: boolean;
    otherDevice: boolean;
    pinSimulator: boolean;
  };

  const [simulators, setSimulators] = useState<SimulatorsType>({
    paymentDevice: false,
    otherDevice: false,
    pinSimulator: false,
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
        <S.OpenModelButton 
          onClick={() => showSimulatorHandler('paymentDevice')} 
          $isActive={simulators.paymentDevice}
        >
          Open payment modal
        </S.OpenModelButton>
        <S.OpenModelButton 
          onClick={() => showSimulatorHandler('otherDevice')} 
          $isActive={simulators.otherDevice}
        >
          Demo app
        </S.OpenModelButton>
        <S.OpenModelButton 
          onClick={() => showSimulatorHandler('pinSimulator')} 
          $isActive={simulators.pinSimulator}
        >
          Simulator
        </S.OpenModelButton>
      </S.OpenModalButtonsContainer>

      <DndContext>
        <DraggableModal
          isShown={simulators.paymentDevice}
          hide={() => showSimulatorHandler('paymentDevice')}
          headerText=""
          modalContent={<PaymentTerminal />}
          modalWidth={200}
          modalHeight={400}
        />
        <DraggableModal
          isShown={simulators.otherDevice}
          hide={() => showSimulatorHandler('otherDevice')}
          headerText=""
          modalContent={<OtherDevice />}
          modalWidth={600}
          modalHeight={400}
        />
             <DraggableModal
          isShown={simulators.pinSimulator}
          hide={() => showSimulatorHandler('pinSimulator')}
          headerText=""
          modalContent={<Simulator />}
          modalWidth={250}
          modalHeight={400}
        />
      </DndContext>

    </>
  );
}

export default App;
