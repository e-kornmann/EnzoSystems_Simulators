import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
// axios
import axios from 'axios';
// styled components
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import './style.css';
// components
import InitialScreen from './components/InitialScreen/InititialScreen'
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import LocalAddKey from './components/LocalAddKey/LocalAddKey';
import KeyContent from './components/KeyContent/KeyContent';
import Settings from './components/Settings/Settings';
import ViewKeys from './components/ViewKeys/ViewKeys';
import DeleteDialog from './components/Footer/DeleteDialog';
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
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: ${props => props.theme.colors.text.black};
  font-family: 'Inter', -apple-system, Helvetica, Arial, sans-serif;
  &::-webkit-scrollbar {
    background: transparent; 
    width: 0.35rem;
  }
  &::-webkit-scrollbar-track {
    width: 0.35rem;
  }
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.buttons.gray}; 
    border-radius: 5px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.text.primary}; 
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
  background-color: white;
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
  deviceStatus: DeviceStatuses.CONNECTED,
  headerTitle: 'Room Key Encoder',
  initialized: false,
  localKeys: null,
  selectedKey: null,
  processStatus: ProcessStatuses.WAITING,
  saveKeyClicked: false,
  deleteKeyClicked: false,
  session: null,
  sessionInitialRequest: false,
  sendNextSessionRequest: false,
  showAddKey: { showComponent: false, editMode: false},
  saveButtonIsEnabled: false,
  deleteButtonIsEnabled: false,
  showDeleteDialog: false,
  showBack: false,
  showCross: false,
  clickedBack: false,
  clickedCross: false,
  showKeys: { showComponent: false, editMode: false, deleteMode: false },
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
    case 'clicked-back': {
      return { ...state, clickedBack: action.payload, showBack: false,};
    }
    case 'clicked-cross': {
      return { ...initialState, 
        tokens: state.tokens,
        tokenPresent: state.tokenPresent,
        localKeys: state.localKeys,
        selectedKey: state.selectedKey,
        deviceStatus: state.deviceStatus,
        headerTitle: 'Room Key Encoder',
        initialized: state.initialized,
      }
    }
    case 'toggle-settings': {
      return { ...state, headerTitle: state.showSettings ? 'Room Key Encoder' : state.headerTitle, showCross: !state.showSettings, showSettings: !state.showSettings };
    }
    case 'show-add-key': {
      return { ...state, showAddKey: {...state.showAddkey, showComponent: action.payload}, showCross: true, showKeys: initialState.showKeys};
    }
    case 'edit-key': {
      return { ...state, showAddKey: {...state.showAddkey, showComponent: action.payload, editMode: action.payload}, showCross: true, showKeys: initialState.showKeys, headerTitle: 'Edit Key'};
    }
    case 'save-key-clicked': {
      return { ...state, saveKeyClicked: action.payload };
    }
    case 'delete-key-clicked': {
      return { ...state, deleteKeyClicked: true };
    }
    case 'read-or-create': {
      return { ...state, readOrCreate: action.payload };
    }
    case 'select-key': {
      return { ...state, selectedKey: action.payload };
    }
    case 'save-key': {
      const newKeys = state.localKeys ? [...state.localKeys, action.payload] : [action.payload];
      return { ...state, localKeys: newKeys, saveKeyClicked: false, showAddKey: initialState.showAddKey, selectedKey: action.payload };
    }
    case 'set-save-button': {
      return { ...state, saveButtonIsEnabled: action.payload };
    }
    case 'set-delete-button': {
      return { ...state, deleteButtonIsEnabled: action.payload };
    }
    case 'update-key': {
      const newKeys = state.localKeys ? [...state.localKeys] : [];
      const index = newKeys.findIndex(key => key.keyId === action.payload.keyId);
      
      if (index !== -1) {
        newKeys[index] = action.payload;
      } else {
        console.log('Key is added becouse of new keyId')
        newKeys.push(action.payload);
      }
    
      return { ...state, localKeys: newKeys, saveKeyClicked: false, showAddKey: initialState.showAddKey, selectedKey: action.payload };
    }
    case 'show-keys': {
      return { ...state, showKeys: { ...state.showKeys, showComponent: action.payload}, showCross: true, headerTitle: 'Keys' };
    }
    case 'edit-keys-mode': {
      return { ...state, showKeys: { ...state.showKeys, editMode: action.payload}, headerTitle: 'Edit Keys'};
    }
    case 'delete-keys-mode': {
      return { ...state, showKeys: { ...state.showKeys, editMode: false, deleteMode: true}, headerTitle: 'Delete Keys'};
    }
    case 'show-delete-dialog': {
      return { ...state, showDeleteDialog: action.payload, showCross: !action.payload};
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

  // /* Handle Read or Create Button */
  // const handleReadButton = useCallback(() => dispatch({ type: 'read-or-create', payload: 'READ' }), []);
  // const handleCreateButton = useCallback(() => dispatch({ type: 'read-or-create', payload: 'CREATE' }), []);

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
        <GlobalStyle />
        <AppDispatchContext.Provider value={dispatch}>
          <TokenContext.Provider value={state.tokens}>
            <StyledApp>

              <Header showBack={state.showBack} showCross={state.showCross} title={state.headerTitle} />

              <StyledContent>
         
                {!state.showSettings && !state.showAddKey.showComponent && !state.showKeys.showComponent &&
                  <StyledContent>

                   

                   
{((state.processStatus !== ProcessStatuses.SCANNING && state.processStatus !== ProcessStatuses.CREATE_KEY)) &&

                  <InitialScreen selectedKey={state.selectedKey} deviceStatus={state.deviceStatus} />}
                    {((state.processStatus === ProcessStatuses.SCANNING || state.processStatus === ProcessStatuses.CREATE_KEY)) &&
                      <KeyContent session={state.session} type={state.session.metadata.name} selectedKey={state.selectedKey} readOrCreate={state.readOrCreate} />}
                  </StyledContent>}
                {!state.showSettings && !state.showKeys.showComponent && state.showAddKey.showComponent &&
                  <StyledContent>
                    <LocalAddKey saveKeyClicked={state.saveKeyClicked} selectedKey={state.selectedKey} editMode={state.showAddKey.editMode} />
                  </StyledContent>}
                { (!state.showSettings && !state.showAddKey.showComponent && state.showKeys.showComponent ) &&
                  <StyledContent>
                    <ViewKeys deleteKeyClicked={state.deleteKeyClicked} keys={state.localKeys} selectedKey={state.selectedKey} editMode={state.showKeys.editMode} deleteMode={state.showKeys.deleteMode}/>
                    { state.showDeleteDialog && <DeleteDialog/>  }
                  </StyledContent>}
                {state.showSettings &&
                  <Settings clickedBack={state.clickedBack} clickedCross={state.clickedCross} deviceStatus={state.deviceStatus} />}
              </StyledContent>
              <Footer 
                showAddKey={state.showAddKey}
                showSettings={state.showSettings}
                showKeys={state.showKeys}
                saveButtonIsEnabled={state.saveButtonIsEnabled}
                deleteButtonIsEnabled={state.deleteButtonIsEnabled} />
            
             
            </StyledApp>
          </TokenContext.Provider>
        </AppDispatchContext.Provider>
      </StyledWrapper>
    </ThemeProvider>
  );
};

export default App;
