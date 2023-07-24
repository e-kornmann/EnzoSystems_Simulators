// settingsReducer.ts

import { Reducer } from "react";
import { CurrencyCode } from "../../../../types/CurrencyTypes";

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

export type StateDispatchProps = {
  state: AllAppSettings; 
  dispatch: React.Dispatch<SettingsAction>
  }
  
export enum SettingModes {
  SETTINGS,
  OPERATIONAL_MODE,
  CURRENCY,
  LANGUAGE,
  ASK_FOR_PIN,
  SCHEMES,
}

export type AllAppSettings = {
  operationalModeOption: OperationalModeOptionsStates;
  currency: CurrencyCode;
  language: LanguageOptionsStates;
};

export const intitialSettingState: AllAppSettings = {
  operationalModeOption: OperationalModeOptionsStates.NORMAL,
  currency: CurrencyCode.EUR,
  language: LanguageOptionsStates.DUTCH,
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

export type SettingsAction = 
  OperationaModeActionType | 
  CurrencyActionType |
  LanguageActionType;

export const settingsReducer: Reducer<AllAppSettings, SettingsAction> = (state, action) => {
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
    default:
      return state;
  }
};


