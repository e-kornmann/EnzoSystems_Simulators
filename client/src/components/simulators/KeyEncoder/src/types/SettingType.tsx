import DeviceStatusOptions from '../enums/DeviceStatusOptions';
import SettingsTypes from '../enums/SettingsTypes';

type SettingType = {
  currentValue: DeviceStatusOptions,
  options: DeviceStatusOptions[],
  title: string,
  type: SettingsTypes
};

export default SettingType;
