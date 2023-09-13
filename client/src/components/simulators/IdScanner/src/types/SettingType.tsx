import DeviceStatuses from '../enums/DeviceStatuses';
import SettingsTypes from '../enums/SettingsTypes';

type SettingType = {
  currentValue: DeviceStatuses,
  options: DeviceStatuses[],
  title: string,
  type: SettingsTypes
};

export default SettingType;
