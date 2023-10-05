import React, { ReactNode, Reducer, createContext, useReducer } from 'react';
import { OperationalModeOptionsType } from '../components/DeviceSettings/AvailableSettings/OperationalModeOptions';
import { Lang } from '../components/DeviceSettings/AvailableSettings/LanguageOptions';
import CurrencyCode from '../enums/Currency';
import { SupportedSchemesType } from '../enums/SupportedSchemes';

export enum SettingModes {
  SETTINGS,
  OPERATIONAL_MODE,
  CURRENCY,
  LANGUAGE,
  ASK_FOR_PIN,
  AVAILABLE_SCHEMES,
  SELECT_SCHEME,
}

export type AllAppSettings = {
  operationalModeOption: OperationalModeOptionsType;
  currency: CurrencyCode;
  language: Lang;
  askForPin: boolean;
  selectedSchemes: SupportedSchemesType[];
  schemeInUse: SupportedSchemesType;
};

const intitialSettingState: AllAppSettings = {
  operationalModeOption: OperationalModeOptionsType.NORMAL,
  currency: CurrencyCode.EUR,
  language: Lang.DUTCH,
  askForPin: true,
  selectedSchemes: [SupportedSchemesType.GOOGLEPAY, SupportedSchemesType.JCB_BANK, SupportedSchemesType.AMEX, SupportedSchemesType.ALIPAY],
  schemeInUse: SupportedSchemesType.GOOGLEPAY,
};

export type OperationalModeActionType = {
  type: SettingModes.OPERATIONAL_MODE;
  payload: OperationalModeOptionsType;
};

export type CurrencyActionType = {
  type: SettingModes.CURRENCY;
  payload: CurrencyCode;
};

export type LanguageActionType = {
  type: SettingModes.LANGUAGE;
  payload: Lang;
};

export type AskForPinActionType = {
  type: SettingModes.ASK_FOR_PIN;
  payload: boolean;
};

export type AvailableSchemesActionType = {
  type: SettingModes.AVAILABLE_SCHEMES;
  payload: SupportedSchemesType[];
};

export type SelectedSchemeActionType = {
  type: SettingModes.SELECT_SCHEME;
  payload: SupportedSchemesType;
};

export type SettingsAction =
  | OperationalModeActionType
  | CurrencyActionType
  | LanguageActionType
  | AskForPinActionType
  | AvailableSchemesActionType
  | SelectedSchemeActionType;

export type StateDispatchProps = {
  state: AllAppSettings;
  dispatch: React.Dispatch<SettingsAction>;
};

const settingsReducer: Reducer<AllAppSettings, SettingsAction> = (state, action) => {
  switch (action.type) {
    case SettingModes.OPERATIONAL_MODE:
      return {
        ...state,
        operationalModeOption: action.payload,
      };
    case SettingModes.CURRENCY:
      return {
        ...state,
        currency: action.payload,
      };
    case SettingModes.LANGUAGE:
      return {
        ...state,
        language: action.payload,
      };
    case SettingModes.ASK_FOR_PIN:
      return {
        ...state,
        askForPin: action.payload,
      };
    case SettingModes.AVAILABLE_SCHEMES:
      return {
        ...state,
        selectedSchemes: action.payload,
      };
    case SettingModes.SELECT_SCHEME:
      return {
        ...state,
        schemeInUse: action.payload,
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
