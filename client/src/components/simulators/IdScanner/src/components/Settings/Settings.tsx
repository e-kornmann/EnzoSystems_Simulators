import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
// styled components
import styled from 'styled-components';
// components
import { SettingControl } from './SettingControl/SettingControl';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
// enums
import DeviceStatuses from '../../enums/DeviceStatuses';
import SettingType from '../../types/SettingType';
import SettingsTypes from '../../enums/SettingsTypes';
import ActionType from '../../enums/ActionTypes';

const StyledWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.secondary,
  position: 'fixed',
  top: '34px',
  left: '0',
  height: 'calc(100% - 75px)',
  width: '100%',
  padding: '2px 0',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'scroll',
  zIndex: '600',
}));

type SettingsProps = {
  clickedBack: boolean,
  deviceStatus: DeviceStatuses
};

const SettingsComponent = ({ clickedBack, deviceStatus }: SettingsProps) => {
  const appDispatch = useContext(AppDispatchContext);
  const [settingClicked, setSettingClicked] = useState<SettingType | null>(null);

  const settings = useMemo(() => [{
    currentValue: deviceStatus,
    options: [DeviceStatuses.CONNECTED, DeviceStatuses.DISCONNECTED, DeviceStatuses.OUT_OF_ORDER],
    title: 'Device status',
    type: SettingsTypes.DEVICE_STATUS,
  }], [deviceStatus]);

  const handleSettingClicked = useCallback((setting: SettingType) => { // toggle displaying options for this setting
    setSettingClicked(setting);
    appDispatch({ type: ActionType.SET_HEADER_TITLE, payload: setting.title });
    appDispatch({ type: ActionType.SHOW_BACK, payload: true });
  }, [appDispatch]);

  const handleOptionClicked = useCallback((option: DeviceStatuses, setting: SettingType) => { // select an option in the currently active setting
    if (setting) {
      if (setting.type === SettingsTypes.DEVICE_STATUS) {
        appDispatch({ type: ActionType.SET_DEVICE_STATUS, payload: option });
        const newSetting = { ...setting };
        newSetting.currentValue = option;
        setSettingClicked(newSetting);
      }
    }
  }, [appDispatch]);

  useEffect(() => { // Return to Settings menu from an Options list
    if (clickedBack && settingClicked) {
      setSettingClicked(null);
      appDispatch({ type: ActionType.SET_HEADER_TITLE, payload: 'Settings' });
      appDispatch({ type: ActionType.CLICKED_BACK, payload: false });
    }
  }, [appDispatch, clickedBack, settingClicked]);

  useEffect(() => { // On load, set header to display 'Settings' as title
    appDispatch({ type: ActionType.SET_HEADER_TITLE, payload: 'Settings' });
  }, [appDispatch]);

  return (
    <StyledWrapper>
      {!settingClicked && settings.map(setting => (
        <SettingControl key={setting.type} isSetting text={setting.title} onClick={() => { handleSettingClicked(setting); }} />
      ))}
      {settingClicked && settingClicked.options.map(option => (
        <SettingControl
         key={option}
         isSelected={settingClicked.currentValue === option}
         text={option}
         onClick={() => { handleOptionClicked(option, settingClicked); }} />
      ))}
    </StyledWrapper>
  );
};

export const Settings = memo(SettingsComponent);
