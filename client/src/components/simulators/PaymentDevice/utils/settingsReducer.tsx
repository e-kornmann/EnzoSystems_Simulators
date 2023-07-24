import { Reducer } from "react";
import { CurrencyCode } from "../../../../types/CurrencyTypes";


export type StateDispatchProps = {
  state: AllAppSettings; 
  dispatch: React.Dispatch<SettingsAction>;
}

export enum SettingModes {
  SETTINGS,
  OPERATIONAL_MODE,
  CURRENCY,
  LANGUAGE,
  ASK_FOR_PIN,
  SCHEMES,
}

export enum OperationalModeOptionsStates {
  NORMAL = 'Normal',
  ALWAYS_SUCCEED = 'Always succeed',
  ALWAYS_FAIL = 'Always fail',
  FIRST_FAIL = 'First fail' ,
  FIRST_FAIL_THEN_SUCCEED = 'First fail, then succeed',
}

export enum LanguageOptionsStates {
  DUTCH = 'Dutch',
  ENGLISH = 'English',
  CHALCATONGO = 'Chalcatongo',
}

export enum SupportedSchemesType {
  THIS_SCHEME = 'This scheme',
  THAT_SCHEME = 'That scheme',
}

export type AllAppSettings = {
  operationalModeOption: OperationalModeOptionsStates;
  currency: CurrencyCode;
  language: LanguageOptionsStates;
  askForPin: boolean;
  supportedSchemes: SupportedSchemesType[];
};

export const intitialSettingState: AllAppSettings = {
  operationalModeOption: OperationalModeOptionsStates.NORMAL,
  currency: CurrencyCode.EUR,
  language: LanguageOptionsStates.DUTCH,
  askForPin: true,
  supportedSchemes: [SupportedSchemesType.THIS_SCHEME],
};

type OperationaModeActionType = {
  type: SettingModes.OPERATIONAL_MODE;
  payload: OperationalModeOptionsStates;
};

type CurrencyActionType = {
  type: SettingModes.CURRENCY;
  payload: CurrencyCode; 
};

type LanguageActionType = {
  type: SettingModes.LANGUAGE;
  payload: LanguageOptionsStates; 
};

type AskForPinActionType = {
  type: SettingModes.ASK_FOR_PIN;
  payload: boolean; 
};

type SupportedSchemesActionType = {
  type: SettingModes.SCHEMES;
  payload: SupportedSchemesType[]; 
};

export type SettingsAction =
  | OperationaModeActionType
  | CurrencyActionType
  | LanguageActionType
  | AskForPinActionType
  | SupportedSchemesActionType;

export const settingsReducer: Reducer<AllAppSettings, SettingsAction> = (
  state,
  action
) => {
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
    case SettingModes.SCHEMES:
      return {
        ...state,
        supportedSchemes: action.payload,
      };
    default:
      return state;
  }
};


