import { useCallback, useState } from 'react';
import { DraggableModal } from './components/shared/DraggableModal/Modal';
import './styles/style.css'
import { DndContext } from '@dnd-kit/core';
import * as S from './styles/App.style';

import PaymentTerminal from './components/simulators/PaymentDevice/PaymentTerminal';
import DemoApp from './components/simulators/DemoApp/DemoApp';
import QrScanner from './components/simulators/QR-Scanner';


function App() {
  type SimulatorsType = {
    paymentDevice: boolean;
    demoApp: boolean;
    QrScanner: boolean;
  };

  const [simulators, setSimulators] = useState<SimulatorsType>({
    paymentDevice: false,
    demoApp: false,
    QrScanner: false,
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
          onClick={() => showSimulatorHandler('QrScanner')} 
          $isActive={simulators.QrScanner}
        >
          Qr Scanner
        </S.OpenModelButton>
      </S.OpenModalButtonsContainer>

      <DndContext>
        <DraggableModal
          isShown={simulators.paymentDevice}
          hide={() => showSimulatorHandler('paymentDevice')}
          headerText=""
          modalContent={<PaymentTerminal />}
          modalWidth={'220px'}
          modalHeight={'435px'}
        />
        <DraggableModal
          isShown={simulators.demoApp}
          hide={() => showSimulatorHandler('demoApp')}
          headerText=""
          modalContent={<DemoApp />}
          modalWidth={'300px'}
          modalHeight={'500px'}
        />
             <DraggableModal
          isShown={simulators.QrScanner}
          hide={() => showSimulatorHandler('QrScanner')}
          headerText=""
          modalContent={<QrScanner />}
          modalWidth={'220px'}
          modalHeight={'435px'}
        />
      </DndContext>

    </>
  );
}

export default App;
