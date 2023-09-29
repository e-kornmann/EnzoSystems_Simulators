import { ReactNode, createContext, useReducer } from 'react';
import settingsReducer, { SettingsAction } from '../../utils/settingReducer';
import { SettingStateType } from '../../types/SettingStateType';
import APPSETTINGS from '../../enums/AppSettings';
import BINSTATUSES from '../../enums/BinStatus';
import CARDPOSITIONS from '../../enums/CardPosition';
import DEVICESTATUSOPTIONS from '../../enums/DeviceStatusOptions';
import STACKSTATUSES from '../../enums/StackStatus';

type SettingContextProviderProps = {
  children: ReactNode;
};
type SettingContextValue = {
  settingState: SettingStateType;
  settingDispatch: React.Dispatch<SettingsAction>;
};

const intitialSettingState: SettingStateType = {
  [APPSETTINGS.DEVICE_STATUS]: DEVICESTATUSOPTIONS.CONNECTED,
  [APPSETTINGS.CARD_STACK]: STACKSTATUSES.FULL,
  [APPSETTINGS.BIN]: BINSTATUSES.FULL,
  [APPSETTINGS.CARD_POSITION]: CARDPOSITIONS.BEZEL,
  statusSettingIsClicked: false,
};

export const SettingContext = createContext<SettingContextValue>({
  settingState: intitialSettingState,
  settingDispatch: () => null,
});

export const SettingContextProvider = ({ children }: SettingContextProviderProps) => {
  const [settingState, settingDispatch] = useReducer(settingsReducer, intitialSettingState);
  const value = { settingState, settingDispatch };
  return (
      <>
        <SettingContext.Provider value={value}>{children}</SettingContext.Provider>
      </>
  );
};
