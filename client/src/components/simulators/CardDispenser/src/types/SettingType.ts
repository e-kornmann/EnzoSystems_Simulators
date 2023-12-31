import { DEVICESTATUSOPTIONS, APPSETTINGS, STACKSTATUSES, BINSTATUSES, CARDPOSITIONS, FAILPROCESS, BINPOLICY } from '../enums/SettingEnums';

export type AllOptions = DEVICESTATUSOPTIONS | STACKSTATUSES | CARDPOSITIONS | BINSTATUSES | FAILPROCESS | BINPOLICY;

export type SettingType = {
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
} | {
  options: FAILPROCESS[],
  type: APPSETTINGS.FAIL_PROCESS,
} | {
  options: BINPOLICY[],
  type: APPSETTINGS.BIN_POLICY,
};
