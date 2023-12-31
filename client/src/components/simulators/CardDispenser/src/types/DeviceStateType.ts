import { APPSETTINGS } from '../enums/SettingEnums';
import { SettingStateType } from './SettingStateType';

export type DeviceStateType = Pick<SettingStateType,
  typeof APPSETTINGS.DEVICE_STATUS |
  typeof APPSETTINGS.CARD_STACK |
  typeof APPSETTINGS.BIN |
  typeof APPSETTINGS.CARD_POSITION
>;
