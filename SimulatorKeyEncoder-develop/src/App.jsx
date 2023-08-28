import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
// axios
import axios from 'axios';
// styled components
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
// reset css 
import './style.css'
// components
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import LocalAddKey from './components/LocalAddKey/LocalAddKey';
import KeyContent from './components/KeyContent/KeyContent';
import Settings from './components/Settings/Settings';
import ViewKeys from './components/ViewKeys/ViewKeys';
// contexts
import AppDispatchContext from './contexts/dispatch/appDispatchContext';
import TokenContext from './contexts/data/tokenContext';
// enums
import CommandTypes from './enums/CommandTypes';
import DeviceStatuses from './enums/DeviceStatuses';
import ProcessStatuses from './enums/ProcessStatuses';
// theme
import theme from './theme/theme.json';

const GlobalStyle = createGlobalStyle`

`;

const StyledWrapper = styled('div')({
  alignItems: 'center',
  display: 'flex',
  height: '100vh',
  justifyContent: 'center',
  width: '100vw',
});
const StyledApp = styled('div')({
  display: "grid",
  gridTemplateRows: "35px 1fr 40px",
  fontFamily: "'Inter', sans-serif",
  fontSize: "13px",
  width: "100%",
  height: "100%",
  minHeight: "420px",
  overflowY: 'hidden',
  borderRadius: '5px',
});

const StyledContent = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.secondary,
  height: '100%',
  justifyContent: 'center',
  overflowX: 'hidden',
  overflowY: 'hidden',
}));

const initialState = {
  clickedBack: false,
  clickedCross: false,
  deviceStatus: DeviceStatuses.CONNECTED,
  headerTitle: 'Room Key Encoder',
  initialized: false,
  localKeys: null,
  processStatus: ProcessStatuses.WAITING,
  saveKeyClicked: false,
  session: null,
  sessionInitialRequest: false,
  sendNextSessionRequest: false,
  showAddKey: false,
  showBack: false,
  showCross: false,
  showKeys: false,
  showSettings: false,
  tokens: null,
  tokenPresent: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'set-device-status': {
      return { ...state, deviceStatus: action.payload };
    }
    case 'set-process-status': {
      return { ...state, processStatus: action.payload };
    }
    case 'set-header-title': {
      return { ...state, headerTitle: action.payload };
    }
    case 'set-session': {
      return { ...state, session: action.payload };
    }
    case 'set-send-next-session-request': {
      return { ...state, sendNextSessionRequest: action.payload };
    }
    case 'set-session-initial-request': {
      return { ...state, sessionInitialRequest: action.payload };
    }
    case 'set-tokens': {
      return { ...state, initialized: true, tokens: action.payload, tokenPresent: true };
    }
    case 'show-back': {
      return { ...state, showBack: action.payload };
    }
    case 'show-cross': {
      return { ...state, showCross: action.payload };
    }
    case 'toggle-settings': {
      return { ...state, headerTitle: state.showSettings ? 'Room Key Encoder' : state.headerTitle, showCross: !state.showSettings, showSettings: !state.showSettings };
    }
    case 'show-add-key': {
      return { ...state, showAddKey: action.payload };
    }
    case 'save-key-clicked': {
      return { ...state, saveKeyClicked: action.payload };
    }
    case 'save-key': {
      const newKeys = state.localKeys ? [...state.localKeys, action.payload] : [action.payload];
      return { ...state, localKeys: newKeys, saveKeyClicked: false, showAddKey: false };
    }
    case 'show-keys': {
      return { ...state, showKeys: action.payload };
    }
    default:
      console.error(`ERROR: this app reducer action type does not exist: ${action.type}`);
      return initialState;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [tick, setTick] = useState(0);
  const initialSessionRequest = useRef(true);

  /* Authenticate Key Encoder "Device" */
  const getToken = useCallback(() => {
    const config = {
      url: `${import.meta.env.VITE_BACKEND_BASE_URL}/auth`,
      headers: {
        authorization: `Basic ${window.btoa('device:device')}`
      },
      method: 'post',
      data: {
        deviceId: 'KeyEncoder'
      },
      timeout: import.meta.env.VITE_TIMEOUT
    };

    const getAuthenticationToken = async () => {
      try {
        const response = await axios(config);

        if (!response?.data) {
          throw Error('Missing response data');
        }

        dispatch({ type: 'set-tokens', payload: response.data });
      } catch (error) {
        console.error('Error: retrieving authentication token: ', error);
      }
    };

    getAuthenticationToken();
  }, []);

  /* Call Get Token Until We Have One */
  useEffect(() => {
    if (!state.tokenPresent) {
      getToken();
    }
  }, [state.tokenPresent, tick, getToken]);

  /* Key Encoder Status */
  const handleStatus = useCallback((status) => {
    if (state.tokens && state.tokens.accessToken) {
      const config = {
        url: `${import.meta.env.VITE_BACKEND_BASE_URL}/status`,
        headers: {
          authorization: `Bearer ${state.tokens.accessToken}`
        },
        method: 'put',
        data: {
          status: status
        },
        timeout: import.meta.env.VITE_TIMEOUT
      };

      const updateStatus = async () => {
        try {
          const response = await axios(config);

          if (!response?.data) {
            throw Error('Missing response data');
          }

          console.log(`Updated Status! Key encoder status: ${status}`);
        } catch (error) {
          console.error('Error: updating key encoder status: ', error);
        }
      };

      updateStatus();
    }
  }, [state.tokens]);

  /* Refresh Tick - for sending updated status every X seconds to keep key encoder accessible for backend */
  useEffect(() => {
    const tick = setInterval(() => {
      setTick((prev) => prev + 1);
    }, import.meta.env.VITE_TICK_RATE);

    return () => {
      clearInterval(tick);
    };
  }, []);

  /* Key Encoder Status */
  useEffect(() => {
    if (state.tokens && state.tokens.accessToken) {
      handleStatus(state.deviceStatus);
    }
  }, [state.deviceStatus, state.tokens, tick, handleStatus]);

  /* Process Status */
  useEffect(() => {
    if (state.showSettings) { // in settings menu
      dispatch({ type: 'set-process-status', payload: ProcessStatuses.SETTINGS });
    } else if (state?.session?.metadata?.name === CommandTypes.READ_KEY) { // if we have a session from backend and need to read a key
      dispatch({ type: 'set-process-status', payload: ProcessStatuses.SCANNING });
    } else if (state?.session?.metadata?.name === CommandTypes.CREATE_KEY) {
      dispatch({ type: 'set-process-status', payload: ProcessStatuses.CREATE_KEY });
    } else if (state.deviceStatus === DeviceStatuses.CONNECTED) { // waiting for session
      dispatch({ type: 'set-process-status', payload: ProcessStatuses.WAITING });
    }
  }, [state.deviceStatus, state.session, state.showSettings]);

  const getSession = useCallback(() => {
    if (state.tokens && state.tokens.accessToken) {
      const config = {
        url: `${import.meta.env.VITE_BACKEND_BASE_URL}/active-session?longPollingMS=${import.meta.env.VITE_LONG_POLLING_TIME}`,
        headers: {
          authorization: `Bearer ${state.tokens.accessToken}`
        },
        method: 'get',
        timeout: import.meta.env.VITE_LONG_POLLING_TIMEOUT
      };

      const getScanSession = async () => {
        try {
          const response = await axios(config);

          if (response?.data && !response.data?.result) {
            dispatch({ type: 'set-session', payload: response.data });
          }

          dispatch({ type: 'set-send-next-session-request', payload: true }); // next long poll
        } catch (error) {
          if (axios.isCancel(error)) { // this means status in frontend has changed, so request has been cancelled
            console.error('ERROR: retrieving scan session: request cancelled');
          } else if (error?.code === 'ECONNABORTED') {
            console.log('getSession aborted due to status change');
          } else {
            console.error('ERROR: retrieving scan session: ', error);
          }
        }
      };

      getScanSession();
    } else {
      console.error('ERROR: retrieving scan session: missing token');
    }
  }, [state.tokens]);


      // console.log('session: ' + state.session ? state.session.metadata.name: null);


  useEffect(() => {
    if (state.initialized) {
      if (state.processStatus === ProcessStatuses.WAITING && state.tokens?.accessToken && !state.sessionInitialRequest && initialSessionRequest.current) { // while WAITING, send a new "long" poll for a new session (1st request)
        initialSessionRequest.current = false;
        dispatch({ type: 'set-session-initial-request', payload: true });
        getSession();
      } else if (state.processStatus === ProcessStatuses.WAITING && state.tokens?.accessToken && state.sessionInitialRequest && state.sendNextSessionRequest && !initialSessionRequest.current) { // any subsequent request
        dispatch({ type: 'set-send-next-session-request', payload: false });
        getSession();
      }
    }
  }, [state.initialized, state.processStatus, state.tokens, state.sendNextSessionRequest, state.sessionInitialRequest, getSession]);

  return (
    <ThemeProvider theme={theme}>
      <StyledWrapper>
        <GlobalStyle styled={theme} />
        <AppDispatchContext.Provider value={dispatch}>
          <TokenContext.Provider value={state.tokens}>
            <StyledApp>
              
              <Header showBack={state.showBack} showCross={state.showCross} title={state.headerTitle} />
              
              <StyledContent>
                {!state.showSettings && !state.showAddKey && !state.showKeys &&
                  <StyledContent>
                    {((state.processStatus === ProcessStatuses.SCANNING || state.processStatus === ProcessStatuses.CREATE_KEY)) &&
                      <KeyContent session={state.session} type={state.session.metadata.name} />}
                  </StyledContent>}
                {!state.showSettings && !state.showKeys && state.showAddKey &&
                  <StyledContent>
                    <LocalAddKey saveKeyClicked={state.saveKeyClicked} />
                  </StyledContent>}
                {!state.showSettings && !state.showAddKey && state.showKeys &&
                  <StyledContent>
                    <ViewKeys keys={state.localKeys} />
                  </StyledContent>}
                {state.showSettings &&
                  <Settings clickedBack={state.clickedBack} clickedCross={state.clickedCross} deviceStatus={state.deviceStatus} />}
              </StyledContent>
              <Footer showAddKey={state.showAddKey} showSettings={state.showSettings} showKeys={state.showKeys} />
            </StyledApp>
          </TokenContext.Provider>
        </AppDispatchContext.Provider>
      </StyledWrapper>
    </ThemeProvider>
  );
};

export default App;
