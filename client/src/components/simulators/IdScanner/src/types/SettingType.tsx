import DEVICESTATUSOPTIONS from '../enums/DeviceStatusOptions';
import SettingsTypes from '../enums/SettingsTypes';

type SettingType = {
  currentValue: DEVICESTATUSOPTIONS,
  options: DEVICESTATUSOPTIONS[],
  title: string,
  type: SettingsTypes
};

export default SettingType;
