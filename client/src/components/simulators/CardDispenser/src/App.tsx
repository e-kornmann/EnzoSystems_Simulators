import { memo, useReducer } from 'react';
// axios
// styled components
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
// shared component
import { SharedStyledContainer } from '../local_shared/DraggableModal/ModalTemplate';
// components
import { CardDispenser } from './components/CardDispenser/CardDispenser';
import { Settings } from './components/Settings/Settings';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
// contexts
import AppDispatchContext from './contexts/dispatch/AppDispatchContext';
import { SettingContextProvider } from './contexts/dispatch/SettingContext';
// theme
import theme from './theme/theme.json';
// enums
import { Lang } from './enums/SettingEnums';
import AppActions from './enums/AppActions';
// types
import AppDispatchActions from './types/reducerActions/AppDispatchActions';
import CardType from './types/CardType';

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

const StyledApp = styled(SharedStyledContainer)(() => ({
  gridTemplateRows: '35px 1fr 40px',
  overflowY: 'hidden',
}));

const StyledContentWrapper = styled('div')({
  backgroundColor: theme.colors.background.secondary,
  height: '100%',
  width: '100%',
  overflowX: 'hidden',
  overflowY: 'hidden',
});

type AppStateType = {
  appLanguage: Lang,
  headerTitle: string,
  cardData: CardType | undefined,
  // --
  showBack: boolean,
  showCross: boolean,
  clickedBack: boolean,
  clickedCross: boolean,
  showSettings: boolean,
  showBinSettings: boolean,
  showStackSettings: boolean,
};

const initialState: AppStateType = {
  appLanguage: Lang.ENGLISH,
  headerTitle: 'Room Key Dispenser',
  cardData: undefined,
  showBack: false,
  showCross: false,
  clickedBack: false,
  clickedCross: false,
  showSettings: false,
  showBinSettings: false,
  showStackSettings: false,
};

const reducer = (state: AppStateType, action: AppDispatchActions): AppStateType => {
  switch (action.type) {
    case AppActions.CLICKED_BACK: {
      return { ...state, clickedBack: action.payload, showBack: false };
    }
    case AppActions.CLICKED_CROSS: { // close window and return to main screen
      return {
        ...initialState,
        cardData: state.cardData,
      };
    }
    case AppActions.RECEIVE_CARD_DATA: {
      return {
        ...state,
        cardData: action.payload,
      };
    }
    case AppActions.SET_HEADER_TITLE: {
      return { ...state, headerTitle: action.payload };
    }
    case AppActions.SHOW_BIN_SETTINGS: {
      return { ...state, showSettings: true, showBinSettings: true, showCross: true, showBack: true };
    }
    case AppActions.SHOW_STACK_SETTINGS: {
      return { ...state, showSettings: true, showStackSettings: true, showCross: true, showBack: true };
    }
    case AppActions.SHOW_BACK: {
      return { ...state, showBack: action.payload };
    }
    case AppActions.SHOW_CROSS: {
      return { ...state, showCross: action.payload };
    }
    case AppActions.TOGGLE_SETTINGS: {
      return {
        ...state,
        headerTitle: state.showSettings ? 'ID Scanner' : state.headerTitle,
        showCross: !state.showSettings,
        showSettings: !state.showSettings,
      };
    }
    default:
      console.error(`ERROR: this app reducer action does not exist: ${action}`);
      return initialState;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SettingContextProvider>
      <ThemeProvider theme={theme}>
        {!import.meta.env.VITE_EXPORT_MEMO_APP && <GlobalStyle />}
        <AppDispatchContext.Provider value={dispatch}>
          <StyledApp $isDraggable={import.meta.env.VITE_EXPORT_MEMO_APP}>
            <Header
              showBack={state.showBack}
              showCross={state.showCross}
              title={state.headerTitle} />
          <StyledContentWrapper>

              <CardDispenser
                cardData={state.cardData}
                appLanguage={state.appLanguage} />

              {state.showSettings
                && <Settings
                  clickedBack={state.clickedBack}
                  appLanguage={state.appLanguage}
                  showBinSettings={state.showBinSettings}
                  showStackSettings={state.showStackSettings}
                />}
            </StyledContentWrapper>
            <Footer
              showSettings={state.showSettings} />
          </StyledApp>
        </AppDispatchContext.Provider>
      </ThemeProvider>
    </SettingContextProvider>
  );
};

const RoomKeyDispenser = import.meta.env.VITE_EXPORT_MEMO_APP ? memo(App) : App;
export default RoomKeyDispenser;
