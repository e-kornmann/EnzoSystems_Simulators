import DEVICESTATUSOPTIONS from '../enums/DeviceStatusOptions';
import APPSETTINGS from '../enums/AppSettings';
import STACKSTATUSES from '../enums/StackStatus';
import CARDPOSITIONS from '../enums/CardPosition';
import BINSTATUSES from '../enums/BinStatus';

export type SettingStateType = {
  [APPSETTINGS.DEVICE_STATUS]: DEVICESTATUSOPTIONS,
  [APPSETTINGS.CARD_STACK]: STACKSTATUSES,
  [APPSETTINGS.BIN]: BINSTATUSES,
  [APPSETTINGS.CARD_POSITION]: CARDPOSITIONS,
  statusSettingIsClicked: boolean;
};
