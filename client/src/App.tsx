import { useCallback, useState } from 'react';
// create GlobalStyle
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { DndContext } from '@dnd-kit/core';
import theme from './theme/theme.json';
import { DraggableModal } from './components/shared/DraggableModal/Modal';
import DemoApp from './components/simulators/DemoApp/DemoApp';
import QrScanner from './components/simulators/QR-Scanner';
import PaymentTerminalSimulator from './components/simulators/PaymentDevice';
import IdScanner from './components/simulators/IdScanner/src/App';
import KeyEncoder from './components/simulators/KeyEncoder/src/App';

const GlobalStyle = createGlobalStyle`
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: ${theme.colors.text.primary};
  font-family: 'Inter', -apple-system, Helvetica, Arial, sans-serif;
  &::-webkit-scrollbar {
    background: transparent; 
    width: 0.35rem;
  }
  &::-webkit-scrollbar-track {
    width: 0.35rem;
  }
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.buttons.gray}; 
    border-radius: 5px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.text.primary}; 
  };
}

html {
  line-height: 1.15; /* 1 */
  text-size-adjust: 100%; /* 2 */
  font-size: 14px;
 }

body {
  margin: 0;
  overflow-x: hidden;
  background-color: ${theme.colors.background.quaternary};
}

hr {
  box-sizing: content-box; /* 1 */
  height: 0; /* 1 */
  overflow: visible; /* 2 */;
}

pre {
  font-family: monospace; /* 1 */
  font-size: 1em; /* 2 */
}

*, ::before, ::after {box-sizing: border-box;}

body, button, ul, ol, li, input { 
  margin: 0; padding: 0; 
}

button, input {
  max-width: 100%; font: inherit; outline: none; box-shadow: none; line-height: 1.5;
}

button {
  background-color: transparent; border: 0;
}

a {
  text-decoration: none; outline: none;
}

a:hover, a:focus, a:active, a:visited {
  text-decoration: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  appearance: textield;
  -moz-appearance: textfield;
}

.wrap {
  height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;
}
`;

const StyledOpenModalButtonsContainer = styled('div')({
  position: 'absolute',
  bottom: '0',
  right: '0',
  display: 'flex',
  flexDirection: 'row',
  rowGap: '15px',
  columnGap: '5px',
  padding: '4px',
});

const StyledOpenModelButton = styled('button')<{ $isActive: boolean }>(({ $isActive }) => ({
  appearance: 'none',
  border: '1px solid rgba(27, 31, 35, 0.15)',
  borderRadius: '6px',
  boxShadow: 'rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset',
  boxSizing: 'border-box',
  color: '#24292E',
  cursor: 'pointer',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '20px',
  listStyle: 'none',
  padding: '6px 16px',
  position: 'relative',
  transition: 'background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1)',
  userSelect: 'none',
  WebkitUserSelect: 'none',
  touchAction: 'manipulation',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  wordWrap: 'break-word',
  backgroundColor: $isActive ? theme.colors.buttons.lightgray : theme.colors.background.primary,
  '&:active': {
    backgroundColor: 'darkgray',
    transition: 'none 0s',
    boxShadow: 'gray 1px 1px 0 0',
    transform: 'translate(1px, 1px)',
  },
  '&:hover': {
    background: 'gray',
    color: '#fff',
  },
}));

type SimulatorsType = {
  paymentDevice: boolean;
  demoApp: boolean;
  qrScanner: boolean;
  roomKeyEncoder: boolean;
  iDScanner: boolean;
};

const App = () => {
  const [simulators, setSimulators] = useState<SimulatorsType>({
    paymentDevice: false,
    demoApp: false,
    qrScanner: false,
    roomKeyEncoder: false,
    iDScanner: false,
  });

  const showSimulatorHandler = useCallback((simulator: keyof SimulatorsType) => {
    setSimulators(prevSimulators => ({
      ...prevSimulators,
      [simulator]: !prevSimulators[simulator],
    }));
  }, []);

  return (
    <>
    <ThemeProvider theme={theme}>
    <GlobalStyle />
      <StyledOpenModalButtonsContainer>
        <StyledOpenModelButton
          onClick={() => showSimulatorHandler('paymentDevice')}
          $isActive={simulators.paymentDevice}
        >
          Open payment modal
        </StyledOpenModelButton>
        <StyledOpenModelButton
          onClick={() => showSimulatorHandler('demoApp')}
          $isActive={simulators.demoApp}
        >
          Demo app
        </StyledOpenModelButton>
        <StyledOpenModelButton
          onClick={() => showSimulatorHandler('qrScanner')}
          $isActive={simulators.qrScanner}
        >
          Qr Scanner
        </StyledOpenModelButton>
        <StyledOpenModelButton
          onClick={() => showSimulatorHandler('iDScanner')}
          $isActive={simulators.roomKeyEncoder}
        >
          Room Key Encoder
        </StyledOpenModelButton>
        <StyledOpenModelButton
          onClick={() => showSimulatorHandler('roomKeyEncoder')}
          $isActive={simulators.roomKeyEncoder}
        >
          Id Scanner
        </StyledOpenModelButton>
      </StyledOpenModalButtonsContainer>

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
          isShown={simulators.qrScanner}
          hide={() => showSimulatorHandler('qrScanner')}
          modalContent={<QrScanner />}
          modalWidth={'220px'}
          modalHeight={'435px'}
        />
      <DraggableModal
          isShown={simulators.roomKeyEncoder}
          hide={() => showSimulatorHandler('roomKeyEncoder')}
          modalContent={<KeyEncoder />}
          modalWidth={'220px'}
          modalHeight={'435px'}
        />
      <DraggableModal
          isShown={simulators.iDScanner}
          hide={() => showSimulatorHandler('iDScanner')}
          modalContent={<IdScanner />}
          modalWidth={'220px'}
          modalHeight={'435px'}
        />
      </DndContext>
    </ThemeProvider>
    </>
  );
};

export default App;
