import { ReactNode, Reducer, createContext, useReducer } from "react";
import React from "react";
import { Lang } from "../QrAppModi/DeviceSettings/AvailableSettings/LanguageOptions";
import { OperationalModeOptionsType } from "../QrAppModi/DeviceSettings/AvailableSettings/OperationalModeOptions";


export enum SettingModes {
  SETTINGS,
  OPERATIONAL_MODE,
  LANGUAGE,
  HIDE,
}

export type AllAppSettings = {
  operationalModeOption: OperationalModeOptionsType;
  language: Lang;
};

const intitialSettingState: AllAppSettings = {
  operationalModeOption: OperationalModeOptionsType.OUT_OF_ORDER,
  language: Lang.DUTCH,
};

export type OperationalModeActionType = {
  type: SettingModes.OPERATIONAL_MODE;
  payload: OperationalModeOptionsType;
};

export type LanguageActionType = {
  type: SettingModes.LANGUAGE;
  payload: Lang;
};

export type SettingsAction =
  | OperationalModeActionType
  | LanguageActionType

export type StateDispatchProps = {
  state: AllAppSettings;
  dispatch: React.Dispatch<SettingsAction>;
}

const settingsReducer: Reducer<AllAppSettings, SettingsAction> = (state, action) => {
  switch (action.type) {
    case SettingModes.OPERATIONAL_MODE:
      return {
        ...state,
        operationalModeOption: action.payload,
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
  dispatch: () => void {},
});



type AppContextProviderProps = {
  children: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const [state, dispatch] = useReducer(settingsReducer, intitialSettingState);
  const value = { state, dispatch };
  return (
    <>
      <AppContext.Provider value={value}>{children}</AppContext.Provider>
    </>
  );
};
