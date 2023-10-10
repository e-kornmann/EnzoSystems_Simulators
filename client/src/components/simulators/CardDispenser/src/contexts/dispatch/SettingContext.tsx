import { ReactNode, createContext, useReducer } from 'react';
import settingsReducer, { SettingsAction } from '../../utils/settingReducer';
import { SettingStateType } from '../../types/SettingStateType';
import { APPSETTINGS, DEVICESTATUSOPTIONS, STACKSTATUSES, BINSTATUSES, CARDPOSITIONS, FAILPROCESS, BINPOLICY } from '../../enums/SettingEnums';

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
  [APPSETTINGS.BIN]: BINSTATUSES.EMPTY,
  [APPSETTINGS.CARD_POSITION]: CARDPOSITIONS.BEZEL,
  [APPSETTINGS.FAIL_PROCESS]: FAILPROCESS.SPORADICALLY,
  [APPSETTINGS.BIN_POLICY]: BINPOLICY.ONLYFAULSYCARDS,
  statusSettingIsClicked: false,
  cardStackSettingIsClicked: false,
  binStackSettingIsClicked: false,
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
