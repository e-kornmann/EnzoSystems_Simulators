import { useCallback, useState } from 'react';
import { DraggableModal } from './components/shared/DraggableModal/Modal';
import './styles/style.css'
import { DndContext } from '@dnd-kit/core';
import * as S from './styles/App.style';
import { Simulator } from './components/simulators/PaymentDevice_Erik/simulator'
import PaymentTerminal from './components/simulators/PaymentDevice/PaymentTerminal';
import DemoApp from './components/simulators/DemoApp/DemoApp';




function App() {
  type SimulatorsType = {
    paymentDevice: boolean;
    demoApp: boolean;
    pinSimulator: boolean;
  };

  const [simulators, setSimulators] = useState<SimulatorsType>({
    paymentDevice: false,
    demoApp: false,
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
          onClick={() => showSimulatorHandler('demoApp')} 
          $isActive={simulators.demoApp}
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
          modalHeight={420}
        />
        <DraggableModal
          isShown={simulators.demoApp}
          hide={() => showSimulatorHandler('demoApp')}
          headerText=""
          modalContent={<DemoApp />}
          modalWidth={300}
          modalHeight={500}
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
