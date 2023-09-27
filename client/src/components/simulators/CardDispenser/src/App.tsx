import { memo, useEffect, useReducer } from 'react';
// axios
// styled components
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
// shared component
import { SharedStyledContainer } from '../local_shared/DraggableModal/ModalTemplate';
// components
import { IdReader } from './components/IdReader/IdReader';
import { LocalAddId } from './components/LocalAddId/LocalAddId';
import { ViewIds } from './components/ViewIds/ViewIds';
import { Settings } from './components/Settings/Settings';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { DeleteDialog } from './components/Footer/DeleteDialog';
// contexts
import AppDispatchContext from './contexts/dispatch/AppDispatchContext';
// enums
import DeviceStatusOptions from './enums/DeviceStatusOptions';
// theme
import theme from './theme/theme.json';
// types
import AppDispatchActions from './types/reducerActions/AppDispatchActions';
import ActionType from './enums/ActionTypes';
import { CountriesAlpha3 } from './enums/CountryCodesISO3166Alpha3';
import { IdType } from './types/IdType';
import ShowAddIdType from './types/ShowAddIdType';
import ShowIdType from './types/ShowIdType';

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

const StyledApp = styled(SharedStyledContainer)({
  gridTemplateRows: '35px 1fr 40px',
  overflowY: 'hidden',
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
  deviceStatus: DeviceStatusOptions,
  statusSettingIsClicked: boolean,
  appLanguage: Lang,
  headerTitle: string,
  localIds: IdType[],
  currentId: IdType | undefined,
  saveIdClicked: boolean,
  showAddKey: ShowAddIdType,
  // footer
  saveButtonIsEnabled: boolean,
  deleteButtonIsEnabled: boolean,
  allIdsAreSelected: boolean,
  // --
  showDeleteDialog: boolean,
  showBack: boolean,
  showCross: boolean,
  clickedBack: boolean,
  clickedCross: boolean,
  showIds: ShowIdType,
  showSettings: boolean,
};

const initialState: AppStateType = {
  deviceStatus: DeviceStatusOptions.OUT_OF_ORDER,
  statusSettingIsClicked: false,
  appLanguage: Lang.ENGLISH,
  headerTitle: 'Card Dispenser',
  localIds: [],
  currentId: undefined,
  saveIdClicked: false,
  showAddKey: { showComponent: false, editMode: false },
  // footer
  saveButtonIsEnabled: false,
  deleteButtonIsEnabled: false,
  allIdsAreSelected: false,
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
    selectAllIdsClicked: false,
    deselectAllIdsClicked: false,
    deleteIdClicked: false,
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
      return { ...state, showIds: { ...state.showIds, deleteIdClicked: true } };
    }
    case ActionType.SET_ALL_LOCALIDS: {
      return { ...state, localIds: action.payload };
    }
    case ActionType.SAVE_ID: {
      const newIds = state.localIds ? [...state.localIds, action.payload] : [action.payload];
      return {
        ...state,
        localIds: newIds,
        saveIdClicked: false,
        showBack: false,
        showIds: { ...state.showIds, showComponent: true },
        currentId: action.payload,
        headerTitle: 'IDs',
        showAddKey: initialState.showAddKey,
      };
    }
    case ActionType.SAVE_ID_CLICKED: {
      return { ...state, saveIdClicked: action.payload };
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
      return { ...state, allIdsAreSelected: action.payload };
    }
    case ActionType.SET_DEVICE_STATUS: {
      return { ...state, deviceStatus: action.payload };
    }
    case ActionType.STATUS_OPTION_IS_CLICKED: {
      return { ...state, statusSettingIsClicked: action.payload };
    }
    case ActionType.SELECT_ALL_ID_CLICKED: {
      return { ...state, showIds: { ...state.showIds, selectAllIdsClicked: action.payload, deselectAllIdsClicked: false } };
    }
    case ActionType.DESELECT_ALL_ID_CLICKED: {
      return { ...state, showIds: { ...state.showIds, selectAllIdsClicked: false, deselectAllIdsClicked: action.payload } };
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
      const index = newIds.findIndex(iD => iD.documentNumber === action.payload.documentNumber);

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
        { !import.meta.env.VITE_EXPORT_MEMO_APP && <GlobalStyle /> }
        <AppDispatchContext.Provider value={dispatch}>
          <StyledApp $isDraggable={import.meta.env.VITE_EXPORT_MEMO_APP}>
              <Header
                showBack={state.showBack}
                showCross={state.showCross}
                title={state.headerTitle}
                goBackToKeysButton={state.showAddKey.showComponent || state.showIds.editMode || state.showIds.deleteMode} />
              <StyledContentWrapper>

                <IdReader
                 deviceStatus={state.deviceStatus}
                 currentId={state.currentId}
                 statusSettingIsClicked={state.statusSettingIsClicked}
                 appLanguage={state.appLanguage}/>
                {!state.showSettings && !state.showAddKey.showComponent && !state.showIds.showComponent }

                {/* TODO: processStatus ERROR */}
                {!state.showSettings && !state.showIds.showComponent && state.showAddKey.showComponent
                  && <LocalAddId
                  saveKeyClicked={state.saveIdClicked}
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
                 <Footer
                    showAddKey={state.showAddKey}
                    showSettings={state.showSettings}
                    showIds={state.showIds}
                    saveButtonIsEnabled={state.saveButtonIsEnabled}
                    deleteButtonIsEnabled={state.deleteButtonIsEnabled}
                    allIdsAreSelected={state.allIdsAreSelected}
                    enableEditandDeleteButton={state.localIds.length >= 1} />
            </StyledApp>
        </AppDispatchContext.Provider>
    </ThemeProvider>
  );
};

const CardDispenser = import.meta.env.VITE_EXPORT_MEMO_APP ? memo(App) : App;
export default CardDispenser;
