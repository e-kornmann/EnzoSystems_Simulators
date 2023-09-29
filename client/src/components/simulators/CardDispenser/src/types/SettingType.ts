import APPSETTINGS from '../enums/AppSettings';
import BINSTATUSES from '../enums/BinStatus';
import CARDPOSITIONS from '../enums/CardPosition';
import DEVICESTATUSOPTIONS from '../enums/DeviceStatusOptions';
import STACKSTATUSES from '../enums/StackStatus';

type SettingType = {
  options: DEVICESTATUSOPTIONS[],
  type: APPSETTINGS.DEVICE_STATUS,
} | {
  options: STACKSTATUSES[],
  type: APPSETTINGS.CARD_STACK,
} | {
  options: BINSTATUSES[],
  type: APPSETTINGS.BIN,
} | {
  options: CARDPOSITIONS[],
  type: APPSETTINGS.CARD_POSITION,
};

export default SettingType;
