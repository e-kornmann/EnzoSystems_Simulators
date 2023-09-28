import { useCallback, useMemo, useState } from 'react';
// create GlobalStyle
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { DndContext } from '@dnd-kit/core';
import theme from './theme/theme.json';
import { DraggableModal } from './components/shared/DraggableModal/Modal';
import DemoApp from './components/simulators/DemoApp/DemoApp';
import QrScanner from './components/simulators/QR-Scanner/src/App';
import PaymentTerminalSimulator from './components/simulators/PaymentDevice';
import IdScanner from './components/simulators/IdScanner/src/App';
import KeyEncoder from './components/simulators/KeyEncoder/src/App';
import CardDispenser from './components/simulators/CardDispenser/src/App';

const GlobalStyle = createGlobalStyle({
  '*': {
    boxSizing: 'border-box',
    color: theme.colors.text.primary,
    fontFamily: '\'Inter\', -apple-system, Helvetica, Arial, sans-serif',
    margin: 0,
    padding: 0,
  },
  '*, ::before, ::after': {
    boxSizing: 'border-box',
  },
  html: {
    fontSize: '14px',
    lineHeight: 1.15,
    textSizeAdjust: '100%',
  },
  'body, button, ul, ol, li, input': {
    margin: 0,
    padding: 0,
  },
  body: {
    backgroundColor: theme.colors.background.quaternary,
    overflowY: 'auto',
    overflowX: 'hidden',
    WebkitOverflowScrolling: 'touch',
  },
  hr: {
    boxSizing: 'content-box',
    height: 0,
    overflow: 'visible',
  },
  pre: {
    fontFamily: 'monospace',
    fontSize: '1em',
  },
  'button, input': {
    boxShadow: 'none',
    lineHeight: 1.5,
    maxWidth: '100%',
    outline: 'none',
    font: 'inherit',
  },
  button: {
    backgroundColor: 'transparent',
    border: 'none',
  },
  a: {
    textDecoration: 'none',
    outline: 'none',
  },
  'a:hover, a:focus, a:active, a:visited': {
    textDecoration: 'none',
  },
  'input[type=number]': {
    appearance: 'textfield',
    MozAppearance: 'textfield',
  },
  '::-webkit-scrollbar': {
    width: '0.35rem',
  },
  '::-webkit-scrollbar-thumb': {
    background: theme.colors.buttons.gray,
    borderRadius: '5px',
  },
  '::-webkit-scrollbar-thumb:hover': {
    background: 'orange',
  },
});

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
  backgroundColor: $isActive ? theme.colors.background.primary : theme.colors.buttons.lightgray,
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

const enum SIMULATORS {
  paymentDevice = 'Pin Device',
  demoApp = 'Demo App',
  qrScanner = 'Qr Scanner',
  roomKeyEncoder = 'Room Key Encoder',
  iDScanner = 'ID Scanner',
  roomKeyDispenser = 'Room Key Dispenser',
}

type SimulatorsType = {
  [key in SIMULATORS]: boolean;
};

const App = () => {
  const [simulators, setSimulators] = useState<SimulatorsType>({
    [SIMULATORS.paymentDevice]: false,
    [SIMULATORS.demoApp]: false,
    [SIMULATORS.qrScanner]: false,
    [SIMULATORS.roomKeyEncoder]: false,
    [SIMULATORS.iDScanner]: false,
    [SIMULATORS.roomKeyDispenser]: false,
  });

  const modalSize = useMemo(() => (simulatorModal: SIMULATORS) => {
    switch (simulatorModal) {
      case SIMULATORS.demoApp:
        return { modalWidth: 300, modalHeight: 500 };
      default:
        return { modalWidth: 220, modalHeight: 435 };
    }
  }, []);

  const getModalContent = useMemo(() => (simulatorModal: SIMULATORS) => {
    switch (simulatorModal) {
      case SIMULATORS.paymentDevice:
        return <PaymentTerminalSimulator />;
      case SIMULATORS.demoApp:
        return <DemoApp />;
      case SIMULATORS.qrScanner:
        return <QrScanner />;
      case SIMULATORS.roomKeyEncoder:
        return <KeyEncoder />;
      case SIMULATORS.iDScanner:
        return <IdScanner />;
      case SIMULATORS.roomKeyDispenser:
        return <CardDispenser />;
      default:
        return null;
    }
  }, []);

  const showSimulatorHandler = useCallback((simulator: SIMULATORS) => {
    setSimulators(prevSimulators => ({
      ...prevSimulators,
      [simulator]: !prevSimulators[simulator],
    }));
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {/* Buttons */}
        <StyledOpenModalButtonsContainer>
          {Object.keys(simulators).map(simulator => (
            <StyledOpenModelButton
              key={simulator}
              onClick={() => showSimulatorHandler(simulator as SIMULATORS)}
              $isActive={simulators[simulator as SIMULATORS]}
            >
              {simulator}
            </StyledOpenModelButton>
          ))}
        </StyledOpenModalButtonsContainer>
        {/* Draggable modals */}
        <DndContext>
          {Object.keys(simulators).map(simulator => (
            <DraggableModal
              key={simulator}
              isShown={simulators[simulator as SIMULATORS]}
              hide={() => showSimulatorHandler(simulator as SIMULATORS)}
              modalContent={getModalContent(simulator as SIMULATORS)}
              {...modalSize(simulator as SIMULATORS)}
            />
          ))}
        </DndContext>
      </ThemeProvider>
    </>
  );
};

export default App;
