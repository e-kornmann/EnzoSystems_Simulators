import React, { ReactNode, Reducer, createContext, useReducer } from 'react';
import { DeviceStatusOptions } from '../../../QR-Scanner/QrAppModi/DeviceSettings/AvailableSettings/StatusOptions';

export enum SettingModes {
  SETTINGS,
  OPERATIONAL_MODE,
  LANGUAGE,
}

export type AllAppSettings = {
  statusOption: DeviceStatusOptions;
  language: string;
};

const intitialSettingState: AllAppSettings = {
  statusOption: DeviceStatusOptions.OUT_OF_ORDER,
  language: 'english',
};

export type OperationalModeActionType = {
  type: SettingModes.OPERATIONAL_MODE;
  payload: DeviceStatusOptions;
};

export type LanguageActionType = {
  type: SettingModes.LANGUAGE;
  payload: string;
};

export type SettingsAction =
  | OperationalModeActionType
  | LanguageActionType;

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
