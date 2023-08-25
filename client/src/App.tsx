import { useCallback, useState } from 'react';
import { DraggableModal } from './components/shared/DraggableModal/Modal';
import './styles/style.css'
import { DndContext } from '@dnd-kit/core';
import * as S from './styles/App.style';

import DemoApp from './components/simulators/DemoApp/DemoApp';
import QrScanner from './components/simulators/QR-Scanner';
import KeyEncoderIframe from './components/simulators/IFrameComponent/KeyEncoder';
import PaymentTerminalSimulator from './components/simulators/PaymentDevice';

function App() {
  type SimulatorsType = {
    paymentDevice: boolean;
    demoApp: boolean;
    QrScanner: boolean;
    roomKeyEncoder: boolean;
  };

  const [simulators, setSimulators] = useState<SimulatorsType>({
    paymentDevice: false,
    demoApp: false,
    QrScanner: false,
    roomKeyEncoder: false,
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
        <S.OpenModelButton 
          onClick={() => showSimulatorHandler('roomKeyEncoder')} 
          $isActive={simulators.roomKeyEncoder}
        >
          Room Key Encoder
        </S.OpenModelButton>
      </S.OpenModalButtonsContainer>

      <DndContext>
        <DraggableModal
          isShown={simulators.paymentDevice}
          hide={() => showSimulatorHandler('paymentDevice')}
          modalContent={<PaymentTerminalSimulator />}
          modalWidth={'220px'}
          modalHeight={'435px'}
        />
        <DraggableModal
          isShown={simulators.demoApp}
          hide={() => showSimulatorHandler('demoApp')}
          modalContent={<DemoApp />}
          modalWidth={'300px'}
          modalHeight={'500px'}
        />
        <DraggableModal
          isShown={simulators.QrScanner}
          hide={() => showSimulatorHandler('QrScanner')}
          modalContent={<QrScanner />}
          modalWidth={'220px'}
          modalHeight={'435px'}
        />
      
      <DraggableModal
          isShown={simulators.roomKeyEncoder}
          hide={() => showSimulatorHandler('roomKeyEncoder')}
          modalContent={<KeyEncoderIframe />}
          modalWidth={'220px'}
          modalHeight={'435px'}
        />



      </DndContext>


    </>
  );
}

export default App;
