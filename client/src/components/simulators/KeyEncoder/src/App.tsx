import { memo, useCallback, useEffect, useReducer, useRef, useState } from 'react';
// axios
import axios from 'axios';
// styled components
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
// components
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Waiting } from './components/Waiting/Waiting';
import { LocalAddKey } from './components/LocalAddKey/LocalAddKey';
import { KeyContent } from './components/KeyContent/KeyContent';
import { Settings } from './components/Settings/Settings';
import { ViewKeys } from './components/ViewKeys/ViewKeys';
import { DeleteDialog } from './components/Footer/DeleteDialog';
// contexts
import AppDispatchContext from './contexts/dispatch/AppDispatchContext';
import TokenContext from './contexts/data/TokenContext';
// enums
import CommandTypes from './enums/CommandTypes';
import DeviceStatuses from './enums/DeviceStatuses';
import ProcessStatuses from './enums/ProcessStatuses';
// theme
import theme from './theme/theme.json';
// types
import AppDispatchActions from './types/reducerActions/AppDispatchActions';
import KeyType from './types/KeyType';
import SessionType from './types/SessionType';
import TokenType from './types/TokenType';
import ShowAddKeyType from './types/ShowAddKeyType';
import ShowKeyType from './types/ShowKeyType';
import ActionType from './enums/ActionTypes';

const GlobalStyle = createGlobalStyle({
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },
  html: {
    color: theme.colors.text.primary,
    fontFamily: "'Inter', -apple-system, Helvetica, Arial, sans-serif",
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
    width: '10px',
  },
  '::-webkit-scrollbar-thumb': {
    background: '#707070',
    borderRadius: '5px',
  },
});
const StyledWrapper = styled('div')({
  alignItems: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  width: '100%',
});
const StyledApp = styled('div')({
  display: 'grid',
  gridTemplateRows: '35px 1fr 40px',
  fontFamily: "'Inter', sans-serif",
  fontSize: '13px',
  width: '100%',
  height: '100%',
  minHeight: '420px',
  overflowY: 'hidden',
  borderRadius: '5px',
});
const StyledContentWrapper = styled('div')({
  backgroundColor: theme.colors.background.secondary,
  height: '100%',
  width: '100%',
  overflowX: 'hidden',
  overflowY: 'hidden',
});

type AppStateType = {
  deviceStatus: DeviceStatuses,
  headerTitle: string,
  initialized: boolean,
  localKeys: KeyType[],
  selectedKey: KeyType | null,
  processStatus: ProcessStatuses,
  saveKeyClicked: boolean,
  session: SessionType | null,
  sendNextSessionRequest: boolean,
  showAddKey: ShowAddKeyType,
  // footer
  saveButtonIsEnabled: boolean,
  deleteButtonIsEnabled: boolean,
  allKeysAreSelected: boolean,
  // --
  showDeleteDialog: boolean,
  showBack: boolean,
  showCross: boolean,
  clickedBack: boolean,
  clickedCross: boolean,
  showKeys: ShowKeyType,
  showSettings: boolean,
  tokens: TokenType | null
};

const initialState: AppStateType = {
  deviceStatus: DeviceStatuses.CONNECTED,
  headerTitle: 'Room Key Encoder',
  initialized: false,
  localKeys: [],
  selectedKey: null,
  processStatus: ProcessStatuses.WAITING,
  saveKeyClicked: false,
  session: null,
  sendNextSessionRequest: false,
  showAddKey: { showComponent: false, editMode: false },
  // footer
  saveButtonIsEnabled: false,
  deleteButtonIsEnabled: false,
  allKeysAreSelected: false,
  // --
  showDeleteDialog: false,
  showBack: false,
  showCross: false,
  clickedBack: false,
  clickedCross: false,
  showKeys: {
    showComponent: false,
    editMode: false,
    deleteMode: false,
    selectAllKeyClicked: false,
    deselectAllKeyClicked: false,
    deleteKeyClicked: false,
  },
  showSettings: false,
  tokens: null,
};

const reducer = (state: AppStateType, action: AppDispatchActions): AppStateType => {
  switch (action.type) {
    case ActionType.CLICKED_BACK: {
      return { ...state, clickedBack: action.payload, showBack: false };
    }
    case ActionType.CLICKED_CROSS: { // close window and return to main screen
      return {
        ...initialState,
        tokens: state.tokens,
        localKeys: state.localKeys,
        selectedKey: state.selectedKey,
        deviceStatus: state.deviceStatus,
        initialized: state.initialized,
      };
    }
    case ActionType.DELETE_KEY_CLICKED: {
      return { ...state, showKeys: { ...state.showKeys, deleteKeyClicked: true } };
    }
    case ActionType.SET_ALL_LOCALKEYS: {
      return { ...state, localKeys: action.payload };
    }
    case ActionType.SAVE_KEY: {
      const newKeys = state.localKeys ? [...state.localKeys, action.payload] : [action.payload];
      return {
        ...state,
        localKeys: newKeys,
        saveKeyClicked: false,
        showBack: false,
        showKeys: { ...state.showKeys, showComponent: true },
        selectedKey: action.payload,
        headerTitle: 'Keys',
        showAddKey: initialState.showAddKey,
      };
    }
    case ActionType.SAVE_KEY_CLICKED: {
      return { ...state, saveKeyClicked: action.payload };
    }
    case ActionType.SELECT_KEY: {
      return { ...state, selectedKey: action.payload };
    }
    case ActionType.SET_DELETE_BUTTON: {
      return { ...state, deleteButtonIsEnabled: action.payload };
    }
    case ActionType.SET_SAVE_BUTTON: {
      return { ...state, saveButtonIsEnabled: action.payload };
    }
    case ActionType.ALL_KEYS_ARE_SELECTED: {
      return { ...state, allKeysAreSelected: action.payload };
    }
    case ActionType.SET_DEVICE_STATUS: {
      return { ...state, deviceStatus: action.payload };
    }
    case ActionType.SELECT_ALL_KEY_CLICKED: {
      return { ...state, showKeys: { ...state.showKeys, selectAllKeyClicked: action.payload, deselectAllKeyClicked: false } };
    }
    case ActionType.DESELECT_ALL_KEY_CLICKED: {
      return { ...state, showKeys: { ...state.showKeys, selectAllKeyClicked: false, deselectAllKeyClicked: action.payload } };
    }
    case ActionType.SET_HEADER_TITLE: {
      return { ...state, headerTitle: action.payload };
    }
    case ActionType.SET_PROCESS_STATUS: {
      return { ...state, processStatus: action.payload };
    }
    case ActionType.SET_SEND_NEXT_SESSION_REQUEST: {
      return { ...state, sendNextSessionRequest: action.payload };
    }
    case ActionType.SET_SESSION: { // *
      return { ...state, session: action.payload };
    }
    case ActionType.SET_TOKENS: { // * not merged
      return { ...state, tokens: action.payload };
    }
    case ActionType.SHOW_ADD_KEY: {
      return {
        ...state,
        showAddKey: { ...state.showAddKey, showComponent: action.payload },
        showCross: true,
        showKeys: initialState.showKeys,
        headerTitle: 'Add new room key',
      };
    }
    case ActionType.EDIT_KEY: {
      return {
        ...state,
        showAddKey: { ...state.showAddKey, showComponent: action.payload, editMode: action.payload },
        showCross: true,
        showKeys: initialState.showKeys,
        headerTitle: 'Edit Key',
      };
    }
    case ActionType.EDIT_KEYS_MODE: {
      return { ...state, showKeys: { ...state.showKeys, editMode: action.payload }, headerTitle: 'Edit Keys' };
    }
    case ActionType.DELETE_KEYS_MODE: {
      return { ...state, showKeys: { ...state.showKeys, editMode: false, deleteMode: true }, headerTitle: 'Delete Keys' };
    }
    case ActionType.SHOW_DELETE_DIALOG: {
      return { ...state, showDeleteDialog: action.payload, showCross: !action.payload };
    }
    case ActionType.SHOW_BACK: {
      return { ...state, showBack: action.payload };
    }
    case ActionType.SHOW_CROSS: {
      return { ...state, showCross: action.payload };
    }
    case ActionType.SHOW_KEYS: {
      return {
        ...state,
        showKeys: { ...initialState.showKeys, showComponent: action.payload },
        showCross: true,
        headerTitle: 'Keys',
        showAddKey: initialState.showAddKey,
      };
    }
    case ActionType.UPDATE_KEY: {
      const newKeys = state.localKeys ? [...state.localKeys] : [];
      const index = newKeys.findIndex(key => key.keyId === action.payload.keyId);

      if (index !== -1) {
        newKeys[index] = action.payload;
      } else {
        newKeys.push(action.payload);
      }

      return { ...state, localKeys: newKeys, selectedKey: action.payload };
    }
    case ActionType.TOGGLE_SETTINGS: {
      return {
        ...state,
        headerTitle: state.showSettings ? 'Room Key Encoder' : state.headerTitle,
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
  const [tick, setTick] = useState(0);
  const initialSessionRequest = useRef(true);

  // set LocalStorage Keys if update is needed
  useEffect(() => {
    // set localKeys
    const getSelectedRoomKey = localStorage.getItem('selectedRoomKey');
    if (state.selectedKey && (!getSelectedRoomKey || (getSelectedRoomKey && getSelectedRoomKey !== JSON.stringify(state.selectedKey)))) {
      localStorage.setItem('selectedRoomKey', JSON.stringify(state.selectedKey));
    }
    // set selectedKey
    const getKeys = localStorage.getItem('roomKeys');
    if (state.localKeys && state.localKeys.length > 0 && (!getKeys || (getKeys && getKeys !== JSON.stringify(state.localKeys)))) {
      localStorage.setItem('roomKeys', JSON.stringify(state.localKeys));
    }
  }, [state.selectedKey, state.localKeys]);

  // load LocalStorage Keys if available
  useEffect(() => {
    // get localKeys
    const getKeys = localStorage.getItem('roomKeys');
    if (getKeys) dispatch({ type: ActionType.SET_ALL_LOCALKEYS, payload: JSON.parse(getKeys) });
    // get selectedKey
    const getSelectedRoomKey = localStorage.getItem('selectedRoomKey');
    if (getSelectedRoomKey) dispatch({ type: ActionType.SELECT_KEY, payload: JSON.parse(getSelectedRoomKey) });
  }, []);

  /* Refresh Tick - for sending updated status every X seconds to keep key encoder accessible for backend */
  useEffect(() => {
    const intervalTick = setInterval(() => {
      setTick(prev => prev + 1);
    }, import.meta.env.VITE_TICK_RATE);

    return () => {
      clearInterval(intervalTick);
    };
  }, []);

  /* Get Token for Key Encoder "Device" */
  const getToken = useCallback(() => {
    const config = {
      url: `${import.meta.env.VITE_BACKEND_BASE_URL}/auth`,
      headers: {
        authorization: `Basic ${window.btoa('device:device')}`,
      },
      method: 'post',
      data: {
        deviceId: '123456',
      },
      timeout: import.meta.env.VITE_TIMEOUT,
    };

    const getAuthenticationToken = async () => {
      try {
        const response = await axios(config);

        if (!response?.data) {
          throw Error('Missing response data');
        }

        dispatch({ type: ActionType.SET_TOKENS, payload: response.data });
      } catch (error) {
        console.error('Error: retrieving authentication token: ', error);
      }
    };

    getAuthenticationToken();
  }, []);

  /* Authenticate until we have a Token */
  useEffect(() => {
    if (!state.tokens) {
      getToken();
    }
  }, [state.tokens, tick, getToken]);

  /* Key Encoder Status */
  const handleStatus = useCallback((status: DeviceStatuses) => {
    if (state.tokens && state.tokens.accessToken) {
      const config = {
        url: `${import.meta.env.VITE_BACKEND_BASE_URL}/status`,
        headers: {
          authorization: `Bearer ${state.tokens.accessToken}`,
        },
        method: 'put',
        data: {
          status,
        },
        timeout: import.meta.env.VITE_TIMEOUT,
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

  /* Key Encoder Status */
  useEffect(() => {
    if (state.tokens && state.tokens.accessToken) {
      handleStatus(state.deviceStatus);
    }
  }, [state.deviceStatus, state.tokens, tick, handleStatus]);

  /* Process Status */
  useEffect(() => {
    if (state.showSettings) { // in settings menu
      dispatch({ type: ActionType.SET_PROCESS_STATUS, payload: ProcessStatuses.SETTINGS });
    } else if (state.showAddKey.showComponent) {
      dispatch({ type: ActionType.SET_PROCESS_STATUS, payload: ProcessStatuses.ADD_KEY });
    } else if (state.showKeys.showComponent) {
      dispatch({ type: ActionType.SET_PROCESS_STATUS, payload: ProcessStatuses.VIEW_KEYS });
    } else if (state?.session?.metadata?.command === CommandTypes.READ_KEY) { // if we have a session from backend and need to read a key
      dispatch({ type: ActionType.SET_PROCESS_STATUS, payload: ProcessStatuses.SCANNING });
    } else if (state?.session?.metadata?.command === CommandTypes.CREATE_KEY
      || state?.session?.metadata?.command === CommandTypes.CREATE_COPY_KEY
      || state?.session?.metadata?.command === CommandTypes.CREATE_JOINNER_KEY
      || state?.session?.metadata?.command === CommandTypes.CREATE_NEW_KEY) {
      dispatch({ type: ActionType.SET_PROCESS_STATUS, payload: ProcessStatuses.CREATE_KEY });
    } else if (state.deviceStatus === DeviceStatuses.CONNECTED) { // waiting for session
      dispatch({ type: ActionType.SET_PROCESS_STATUS, payload: ProcessStatuses.WAITING });
    }
  }, [state.deviceStatus, state.session, state.showAddKey, state.showKeys, state.showSettings]);

  /* Get Session */
  const getSession = useCallback(() => {
    if (state.tokens && state.tokens.accessToken) {
      const config = {
        url: `${import.meta.env.VITE_BACKEND_BASE_URL}/active-session`,
        headers: {
          authorization: `Bearer ${state.tokens.accessToken}`,
        },
        method: 'get',
      };

      const getScanSession = async () => {
        try {
          const response = await axios(config);

          if (response?.data && !response.data?.result) {
            dispatch({ type: ActionType.SET_SESSION, payload: response.data });
          }

          dispatch({ type: ActionType.SET_SEND_NEXT_SESSION_REQUEST, payload: true }); // next long poll
        } catch (error) {
          if (axios.isCancel(error)) {
            console.error('ERROR: retrieving scan session: request cancelled');
          } else {
            console.error('ERROR: retrieving scan session: ', error);
          }
          dispatch({ type: ActionType.SET_SEND_NEXT_SESSION_REQUEST, payload: true });
        }
      };

      getScanSession();
    } else {
      console.error('ERROR: retrieving scan session: missing token');
    }
  }, [state.tokens]);

  /* Repeatedly Get Session Based on Process Status */
  useEffect(() => {
    if (state.tokens?.accessToken) {
      // while WAITING, send a new "long" poll for a new session (1st request)
      if (state.processStatus === ProcessStatuses.WAITING && initialSessionRequest.current) {
        initialSessionRequest.current = false;
        getSession();
        // any subsequent request
      } else if (state.processStatus === ProcessStatuses.WAITING && state.sendNextSessionRequest && !initialSessionRequest.current) {
        dispatch({ type: ActionType.SET_SEND_NEXT_SESSION_REQUEST, payload: false });
        getSession();
      }
    }
  }, [state.processStatus, state.tokens, state.sendNextSessionRequest, getSession]);

  return (
    <ThemeProvider theme={theme}>
      <StyledWrapper>
        { !import.meta.env.VITE_EXPORT_MEMO_APP && <GlobalStyle /> }
        <AppDispatchContext.Provider value={dispatch}>
          <TokenContext.Provider value={state.tokens}>
            <StyledApp>
              <Header
                showBack={state.showBack}
                showCross={state.showCross}
                title={state.headerTitle}
                goBackToKeysButton={state.showAddKey.showComponent || state.showKeys.editMode || state.showKeys.deleteMode} />
              <StyledContentWrapper>

                {!state.showSettings && !state.showAddKey.showComponent && !state.showKeys.showComponent
                  && <>
                    {(state.processStatus === ProcessStatuses.WAITING)
                      && <Waiting deviceStatus={state.deviceStatus} selectedKey={state.selectedKey} />}
                    {(state.processStatus === ProcessStatuses.SCANNING || state.processStatus === ProcessStatuses.CREATE_KEY)
                      && <KeyContent selectedKey={state.selectedKey} type={state.session?.metadata.command as CommandTypes} />}
                  </>
                }
                {/* TODO: processStatus ERROR */}
                {!state.showSettings && !state.showKeys.showComponent && state.showAddKey.showComponent
                  && <LocalAddKey saveKeyClicked={state.saveKeyClicked} selectedKey={state.selectedKey} editMode={state.showAddKey.editMode} />
                }
                {!state.showSettings && !state.showAddKey.showComponent && state.showKeys.showComponent
                  && <>
                    <ViewKeys keys={state.localKeys} selectedKey={state.selectedKey} showKeys={state.showKeys} />
                    {state.showDeleteDialog && <DeleteDialog />}
                  </>
                }

                {state.processStatus === ProcessStatuses.SETTINGS
                  && <Settings clickedBack={state.clickedBack} deviceStatus={state.deviceStatus} />}
              </StyledContentWrapper>
              {state
                && <Footer
                  showAddKey={state.showAddKey}
                  showSettings={state.showSettings}
                  showKeys={state.showKeys}
                  saveButtonIsEnabled={state.saveButtonIsEnabled}
                  deleteButtonIsEnabled={state.deleteButtonIsEnabled}
                  allKeysAreSelected={state.allKeysAreSelected}
                  enableEditandDeleteButton={state.localKeys.length >= 1} />
              }
            </StyledApp>
          </TokenContext.Provider>
        </AppDispatchContext.Provider>
      </StyledWrapper>
    </ThemeProvider>
  );
};

const KeyEncoder = import.meta.env.VITE_EXPORT_MEMO_APP ? memo(App) : App;
export default KeyEncoder;
