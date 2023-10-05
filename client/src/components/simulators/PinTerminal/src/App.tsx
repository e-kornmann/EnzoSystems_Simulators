import { memo } from 'react';
// styled components
import { ThemeProvider, createGlobalStyle } from 'styled-components';
// theme
import theme from './theme/theme.json';
// component
import { PinTerminal } from './PinTerminal';
import { AppContextProvider } from './utils/settingsReducer';

const GlobalStyle = createGlobalStyle({
  '*': {
    boxSizing: 'border-box',
    color: theme.colors.text.primary,
    fontFamily: '\'Inter\', -apple-system, Helvetica, Arial, sans-serif',
    margin: 0,
    padding: 0,
  },
  html: {
    fontSize: '14px',
    lineHeight: 1.15,
    overflow: 'hidden',
    textSizeAdjust: '100%',
  },
  body: {
    backgroundColor: theme.colors.background.primary,
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  'button, input': {
    boxShadow: 'none',
    lineHeight: 1.5,
    maxWidth: '100%',
    outline: 'none',
  },
  button: {
    backgroundColor: 'transparent',
    border: 'none',
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

const App = () => (

    <ThemeProvider theme={theme}>
    { !import.meta.env.VITE_EXPORT_MEMO_APP && <GlobalStyle /> }
    <AppContextProvider>
        <PinTerminal/>
      </AppContextProvider>
    </ThemeProvider>
);

const PaymentTerminal = import.meta.env.VITE_EXPORT_MEMO_APP ? memo(App) : App;
export default PaymentTerminal;
