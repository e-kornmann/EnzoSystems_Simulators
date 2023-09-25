import React, { ReactNode, Reducer, createContext, useReducer } from 'react';
import DeviceStatusOptions from '../enums/DeviceStatusOptions';

export enum SettingModes {
  SETTINGS,
  OPERATIONAL_MODE,
  LANGUAGE,
}

export type AllAppSettings = {
  statusOption: DeviceStatusOptions;
  language: string;
  statusSettingIsClicked: boolean,
};

const intitialSettingState: AllAppSettings = {
  statusOption: DeviceStatusOptions.OUT_OF_ORDER,
  language: 'english',
  // statusSettingIsClicked is needed for the click listener in de QrCodeReader component
  statusSettingIsClicked: false,
};

export type OperationalModeActionType = {
  type: SettingModes.OPERATIONAL_MODE;
  payload: DeviceStatusOptions;
};

export type LanguageActionType = {
  type: SettingModes.LANGUAGE;
  payload: string;
};

export type BooleanActionType = {
  type: 'STATUS_OPTION_IS_CLICKED';
  payload: boolean;
};

export type SettingsAction =
  | OperationalModeActionType
  | LanguageActionType
  | BooleanActionType;

export type StateDispatchProps = {
  state: AllAppSettings;
  dispatch: React.Dispatch<SettingsAction>;
};

const settingsReducer: Reducer<AllAppSettings, SettingsAction> = (state, action) => {
  switch (action.type) {
    case SettingModes.OPERATIONAL_MODE:
      return {
        ...state,
        statusOption: action.payload,
      };

    case SettingModes.LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };
    case 'STATUS_OPTION_IS_CLICKED':
      return {
        ...state,
        statusSettingIsClicked: action.payload,
      };

    default:
      return state;
  }
};

type AppContextValue = {
  state: AllAppSettings;
  dispatch: React.Dispatch<SettingsAction>;
};

export const AppContext = createContext<AppContextValue>({
  state: intitialSettingState,
  dispatch: () => null,
});

type AppContextProviderProps = {
  children: ReactNode;
};

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [state, dispatch] = useReducer(settingsReducer, intitialSettingState);
  const value = { state, dispatch };
  return (
    <>
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    </>
  );
};
