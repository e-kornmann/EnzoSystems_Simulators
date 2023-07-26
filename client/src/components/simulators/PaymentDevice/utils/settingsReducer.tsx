import { Reducer } from "react";
import { CurrencyCode } from "../../../../types/CurrencyTypes";

export enum SettingModes {
  SETTINGS,
  OPERATIONAL_MODE,
  CURRENCY,
  LANGUAGE,
  ASK_FOR_PIN,
  AVAILABLE_SCHEMES,
  SELECT_SCHEME,
}

export enum OperationalModeOptionsStatesType {
  NORMAL = 'Normal',
  ALWAYS_SUCCEED = 'Always succeed',
  ALWAYS_FAIL = 'Always fail',
  FIRST_FAIL = 'First fail',
  FIRST_FAIL_THEN_SUCCEED = 'First fail, then succeed',
}

export enum LanguageOptionsStatesType {
  DUTCH = 'Dutch',
  ENGLISH = 'English',
  CHALCATONGO = 'Chalcatongo',
  FRENCH = 'French',
}

export enum SupportedSchemesType {
  ALIPAY = "Alipay",
  AMEX = "AMEX",
  APPLEPAY = "ApplePay",
  BANCONTACT = "Bancontact",
  CARTESBANCAIRES = "Cartes Bancaires",
  DINERS = "Diners Club",
  DISCOVER = "Discover",
  GIROCARD = "Girocard",
  GIROPAY = "Giropay",
  GOOGLEPAY = "Google Pay",
  IDEAL = "iDEAL",
  INTERAC = "Interac",
  JCB_BANK = "JCB",
  MAESTRO = "Maestro",
  MASTERCARD = "Mastercard",
  MASTERCARDDEBIT = "Mastercard Debit",
  MASTERPASS = "Masterpass",
  PAYPAL = "PayPal",
  SWISSPOST = "Swiss Post",
  SWISSREKA = "Swiss Reka",
  TWINT = "Twint",
  UNIONPAY = "UnionPay",
  VISA = "Visa",
  VISAELECTRON = "Visa Electron",
  VISADEBIT = "Visa Debit",
  VPAY = "V PAY",
  WECHATPAY = "WeChat Pay",
}

export type AllAppSettings = {
  operationalModeOption: OperationalModeOptionsStatesType;
  currency: CurrencyCode;
  language: LanguageOptionsStatesType;
  askForPin: boolean;
  availableSchemes: SupportedSchemesType[];
  selectedScheme: SupportedSchemesType;
};

export const intitialSettingState: AllAppSettings = {
  operationalModeOption: OperationalModeOptionsStatesType.NORMAL,
  currency: CurrencyCode.EUR,
  language: LanguageOptionsStatesType.DUTCH,
  askForPin: true,
  availableSchemes: [SupportedSchemesType.GOOGLEPAY, SupportedSchemesType.JCB_BANK, SupportedSchemesType.AMEX, SupportedSchemesType.ALIPAY],
  selectedScheme: SupportedSchemesType.GOOGLEPAY,
};

export type OperationalModeActionType = {
  type: SettingModes.OPERATIONAL_MODE;
  payload: OperationalModeOptionsStatesType;
};

export type CurrencyActionType = {
  type: SettingModes.CURRENCY;
  payload: CurrencyCode;
};

export type LanguageActionType = {
  type: SettingModes.LANGUAGE;
  payload: LanguageOptionsStatesType;
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
}

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
}

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
    case SettingModes.ASK_FOR_PIN:
      return {
        ...state,
        askForPin: action.payload,
      };
    case SettingModes.AVAILABLE_SCHEMES:
      return {
        ...state,
        availableSchemes: action.payload,
      };
    case SettingModes.SELECT_SCHEME:
      return {
        ...state,
        selectedScheme: action.payload,
      };
    default:
      return state;
  }
};



