import { memo, useEffect, useReducer } from 'react';
// axios
// styled components
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
// components
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { LocalAddId } from './components/LocalAddId/LocalAddId';
import { Settings } from './components/Settings/Settings';
import { ViewIds } from './components/ViewIds/ViewIds';
import { DeleteDialog } from './components/Footer/DeleteDialog';
// contexts
import AppDispatchContext from './contexts/dispatch/AppDispatchContext';
// enums
import DeviceStatuses from './enums/DeviceStatuses';
// theme
import theme from './theme/theme.json';
// types
import AppDispatchActions from './types/reducerActions/AppDispatchActions';
import ShowAddKeyType from './types/ShowAddKeyType';
import ShowKeyType from './types/ShowKeyType';
import ActionType from './enums/ActionTypes';
import { IdReader } from './components/IdReader/IdReader';
import { CountriesAlpha3 } from './enums/CountryCodesISO3166Alpha3';
import { IdType } from './types/IdType';

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

export enum Lang {
  DUTCH = CountriesAlpha3.Netherlands,
  ENGLISH = CountriesAlpha3['United Kingdom'],
  GERMAN = CountriesAlpha3.Germany,
  FRENCH = CountriesAlpha3.France,
}

type AppStateType = {
  deviceStatus: DeviceStatuses,
  clickedSetting: boolean,
  appLanguage: Lang,
  headerTitle: string,
  localIds: IdType[],
  currentId: IdType | undefined,
  saveKeyClicked: boolean,
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
  showIds: ShowKeyType,
  showSettings: boolean,
};

const initialState: AppStateType = {
  deviceStatus: DeviceStatuses.OUT_OF_ORDER,
  clickedSetting: false,
  appLanguage: Lang.ENGLISH,
  headerTitle: 'ID Scanner',
  localIds: [],
  currentId: undefined,
  saveKeyClicked: false,
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
  showIds: {
    showComponent: false,
    editMode: false,
    deleteMode: false,
    selectAllKeyClicked: false,
    deselectAllKeyClicked: false,
    deleteKeyClicked: false,
  },
  showSettings: false,
};

const reducer = (state: AppStateType, action: AppDispatchActions): AppStateType => {
  switch (action.type) {
    case ActionType.CLICKED_BACK: {
      return { ...state, clickedBack: action.payload, showBack: false };
    }
    case ActionType.CLICKED_CROSS: { // close window and return to main screen
      return {
        ...initialState,
        deviceStatus: state.deviceStatus,
        localIds: state.localIds,
        currentId: state.currentId,
      };
    }
    case ActionType.DELETE_ID_CLICKED: {
      return { ...state, showIds: { ...state.showIds, deleteKeyClicked: true } };
    }
    case ActionType.SET_ALL_LOCALIDS: {
      return { ...state, localIds: action.payload };
    }
    case ActionType.SAVE_ID: {
      const newIds = state.localIds ? [...state.localIds, action.payload] : [action.payload];
      return {
        ...state,
        localIds: newIds,
        saveKeyClicked: false,
        showBack: false,
        showIds: { ...state.showIds, showComponent: true },
        currentId: action.payload,
        headerTitle: 'IDs',
        showAddKey: initialState.showAddKey,
      };
    }
    case ActionType.SAVE_ID_CLICKED: {
      return { ...state, saveKeyClicked: action.payload };
    }
    case ActionType.SELECT_ID: {
      return { ...state, currentId: action.payload };
    }
    case ActionType.SET_DELETE_BUTTON: {
      return { ...state, deleteButtonIsEnabled: action.payload };
    }
    case ActionType.SET_SAVE_BUTTON: {
      return { ...state, saveButtonIsEnabled: action.payload };
    }
    case ActionType.ALL_IDS_ARE_SELECTED: {
      return { ...state, allKeysAreSelected: action.payload };
    }
    case ActionType.SET_DEVICE_STATUS: {
      return { ...state, deviceStatus: action.payload };
    }
    case ActionType.SET_CLICKED_SETTING: {
      return { ...state, clickedSetting: action.payload };
    }
    case ActionType.SELECT_ALL_ID_CLICKED: {
      return { ...state, showIds: { ...state.showIds, selectAllKeyClicked: action.payload, deselectAllKeyClicked: false } };
    }
    case ActionType.DESELECT_ALL_ID_CLICKED: {
      return { ...state, showIds: { ...state.showIds, selectAllKeyClicked: false, deselectAllKeyClicked: action.payload } };
    }
    case ActionType.SET_HEADER_TITLE: {
      return { ...state, headerTitle: action.payload };
    }
    case ActionType.SHOW_ADD_ID: {
      return {
        ...state,
        showAddKey: { ...state.showAddKey, showComponent: action.payload },
        showCross: true,
        showBack: false,
        showIds: initialState.showIds,
        headerTitle: 'Add new ID',
      };
    }
    case ActionType.EDIT_ID: {
      return {
        ...state,
        showAddKey: { ...state.showAddKey, showComponent: action.payload, editMode: action.payload },
        showCross: true,
        showIds: initialState.showIds,
        headerTitle: 'Edit ID',
      };
    }
    case ActionType.EDIT_IDS_MODE: {
      return { ...state, showIds: { ...state.showIds, editMode: action.payload }, headerTitle: 'Edit IDs' };
    }
    case ActionType.DELETE_IDS_MODE: {
      return { ...state, showIds: { ...state.showIds, editMode: false, deleteMode: true }, headerTitle: 'Delete IDs' };
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
    case ActionType.SHOW_IDS: {
      return {
        ...state,
        showIds: { ...initialState.showIds, showComponent: action.payload },
        showCross: true,
        headerTitle: 'IDs',
        showBack: false,
        showAddKey: initialState.showAddKey,
      };
    }
    case ActionType.UPDATE_ID: {
      const newIds = state.localIds ? [...state.localIds] : [];
      const index = newIds.findIndex(iD => iD.documentNr === action.payload.documentNr);

      if (index !== -1) {
        newIds[index] = action.payload;
      } else {
        newIds.push(action.payload);
      }

      return { ...state, localIds: newIds, currentId: action.payload };
    }
    case ActionType.TOGGLE_SETTINGS: {
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
  // set LocalStorage Keys if update is needed
  useEffect(() => {
    // set localIds in case of no storage or unsynced data,
    const getSelectedId = localStorage.getItem('currentId');
    if (state.currentId && (!getSelectedId || (getSelectedId && getSelectedId !== JSON.stringify(state.currentId)))) {
      localStorage.setItem('currentId', JSON.stringify(state.currentId));
    }
    // set currentId
    const getIDs = localStorage.getItem('IDs');
    if (state.localIds && state.localIds.length > 0 && (!getIDs || (getIDs && getIDs !== JSON.stringify(state.localIds)))) {
      localStorage.setItem('IDs', JSON.stringify(state.localIds));
    }
  }, [state.currentId, state.localIds]);

  // load LocalStorage Keys if available
  useEffect(() => {
    // get localIds
    const getLocalStorageIds = localStorage.getItem('IDs');
    if (getLocalStorageIds) dispatch({ type: ActionType.SET_ALL_LOCALIDS, payload: JSON.parse(getLocalStorageIds) });
    // get currentId
    const getSelectedId = localStorage.getItem('currentId');
    if (getSelectedId) dispatch({ type: ActionType.SELECT_ID, payload: JSON.parse(getSelectedId) });
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <StyledWrapper>
        { !import.meta.env.VITE_EXPORT_MEMO_APP && <GlobalStyle /> }
        <AppDispatchContext.Provider value={dispatch}>
          <StyledApp>
              <Header
                showBack={state.showBack}
                showCross={state.showCross}
                title={state.headerTitle}
                goBackToKeysButton={state.showAddKey.showComponent || state.showIds.editMode || state.showIds.deleteMode} />
              <StyledContentWrapper>

                <IdReader deviceStatus={state.deviceStatus} currentId={state.currentId} clickedSetting={state.clickedSetting} />
                {!state.showSettings && !state.showAddKey.showComponent && !state.showIds.showComponent }

                {/* TODO: processStatus ERROR */}
                {!state.showSettings && !state.showIds.showComponent && state.showAddKey.showComponent
                  && <LocalAddId
                  saveKeyClicked={state.saveKeyClicked}
                  currentId={state.currentId}
                  editMode={state.showAddKey.editMode}
                  appLanguage={state.appLanguage} />
                }
                {!state.showSettings && !state.showAddKey.showComponent && state.showIds.showComponent
                  && <>
                    <ViewIds iDs={state.localIds} currentId={state.currentId} showIds={state.showIds} />
                    {state.showDeleteDialog && <DeleteDialog />}
                  </>
                }

                {state.showSettings
                  && <Settings clickedBack={state.clickedBack} deviceStatus={state.deviceStatus} />}
              </StyledContentWrapper>
              {state
                && <Footer
                  showAddKey={state.showAddKey}
                  showSettings={state.showSettings}
                  showIds={state.showIds}
                  saveButtonIsEnabled={state.saveButtonIsEnabled}
                  deleteButtonIsEnabled={state.deleteButtonIsEnabled}
                  allKeysAreSelected={state.allKeysAreSelected}
                  enableEditandDeleteButton={state.localIds.length >= 1} />
              }
            </StyledApp>
        </AppDispatchContext.Provider>
      </StyledWrapper>
    </ThemeProvider>
  );
};

const IdScanner = import.meta.env.VITE_EXPORT_MEMO_APP ? memo(App) : App;
export default IdScanner;
