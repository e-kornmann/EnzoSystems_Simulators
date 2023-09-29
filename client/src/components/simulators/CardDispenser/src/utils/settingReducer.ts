import { Reducer } from 'react';
import { SettingStateType } from '../types/SettingStateType';
import DEVICESTATUSOPTIONS from '../enums/DeviceStatusOptions';
import APPSETTINGS from '../enums/AppSettings';
import STACKSTATUSES from '../enums/StackStatus';
import CARDPOSITIONS from '../enums/CardPosition';
import BINSTATUSES from '../enums/BinStatus';

export type AllOptions = DEVICESTATUSOPTIONS | STACKSTATUSES | CARDPOSITIONS | BINSTATUSES;

export type SettingsActionType = {
  type: APPSETTINGS;
  payload: AllOptions;
};

export type BooleanActionType = {
  type: 'STATUS_OPTION_IS_CLICKED';
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
      return {
        ...state,
        [action.type]: action.payload,
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

export default settingsReducer;
