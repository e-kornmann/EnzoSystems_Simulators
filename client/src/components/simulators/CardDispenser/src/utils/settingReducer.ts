import { Reducer } from 'react';
import { SettingStateType } from '../types/SettingStateType';
import { APPSETTINGS } from '../enums/SettingEnums';
import { AllOptions } from '../types/SettingType';

export type SettingsActionType = {
  type: APPSETTINGS;
  payload: AllOptions;
};

export type BooleanActionType = {
  type: 'STATUS_OPTION_IS_CLICKED' | 'CARD_STACK_OPTION_IS_CLICKED' | 'BIN_STACK_OPTION_IS_CLICKED';
  payload: boolean;
};

export type SettingsAction =
  | SettingsActionType
  | BooleanActionType;

const settingsReducer: Reducer<SettingStateType, SettingsAction> = (state, action) => {
  switch (action.type) {
    case APPSETTINGS.DEVICE_STATUS:
    case APPSETTINGS.CARD_STACK:
    case APPSETTINGS.BIN:
    case APPSETTINGS.CARD_POSITION:
    case APPSETTINGS.FAIL_PROCESS:
    case APPSETTINGS.BIN_POLICY:
      return {
        ...state,
        [action.type]: action.payload,
      };
    case 'STATUS_OPTION_IS_CLICKED':
      return {
        ...state,
        statusSettingIsClicked: action.payload,
      };
    case 'CARD_STACK_OPTION_IS_CLICKED':
      return {
        ...state,
        cardStackSettingIsClicked: action.payload,
      };
    case 'BIN_STACK_OPTION_IS_CLICKED':
      return {
        ...state,
        binStackSettingIsClicked: action.payload,
      };
    default:
      return state;
  }
};

export default settingsReducer;
