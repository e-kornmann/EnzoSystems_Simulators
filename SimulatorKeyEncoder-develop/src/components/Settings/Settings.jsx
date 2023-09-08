import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
// styled components
import styled from 'styled-components';
// components
import SettingControl from '../SettingControl/SettingControl';
// contexts
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';
// enums
import DeviceStatuses from '../../enums/DeviceStatuses';
import SettingsTypes from '../../enums/SettingsTypes';


const StyledWrapper = styled('div')(({ theme }) => ({
  padding: '2px 0',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflowY: 'scroll',
  '&::-webkit-scrollbar': {
    background: 'transparent',
    width: '0.35rem'
  },
  '&::-webkit-scrollbar-track': {
    width: '0.35rem'
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.colors.buttons.gray,
    borderRadius: '5px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.colors.buttons.asphalt,
  }
}));


const Settings = memo(function Settings({ clickedBack, deviceStatus }) {
  const appDispatch = useContext(AppDispatchContext);
  const [settingClicked, setSettingClicked] = useState(false);

  const settings = useMemo(() => { // available settings
    return [
      {
        currentValue: deviceStatus,
        options: [DeviceStatuses.CONNECTED, DeviceStatuses.DISCONNECTED, DeviceStatuses.OUT_OF_ORDER],
        title: 'Device status',
        type: SettingsTypes.DEVICE_STATUS
      }
    ];
  }, [deviceStatus]);

  const handleSettingClicked = useCallback((setting) => { // toggle displaying options for this specific setting
    setSettingClicked(setting);
    appDispatch({ type: 'set-header-title', payload: setting.title });
    appDispatch({ type: 'show-back', payload: true });
  }, []);


  // when in clicked setting you can click an option
  const handleOptionClicked = useCallback((option, setting) => { // clicked an option for a setting
    if (setting) {
      if (setting.type === SettingsTypes.DEVICE_STATUS) {
        appDispatch({ type: 'set-device-status', payload: option });
        const newSetting = { ...setting };
        newSetting.currentValue = option;
        setSettingClicked(newSetting);
      }
    }
  }, []);

  useEffect(() => { // Return to main Settings menu from an Options list
    if (clickedBack && settingClicked) {
      setSettingClicked(false);
      appDispatch({ type: 'set-header-title', payload: 'Settings' });
      appDispatch({ type: 'clicked-back', payload: false });
    }
  }, [clickedBack, settingClicked]);

  useEffect(() => { // initially set header to display 'Settings' as title
    appDispatch({ type: 'set-header-title', payload: 'Settings' });
  }, []);

  return (
    <StyledWrapper>
      {!settingClicked && settings.map((setting) => (
        <SettingControl key={setting.type} clicked={settingClicked.type === setting.type} setting={setting} onOptionClicked={handleOptionClicked} onSettingClicked={handleSettingClicked} />
      ))}
      {settingClicked &&
        <SettingControl key={settingClicked.type} clicked setting={settingClicked} onOptionClicked={handleOptionClicked} onSettingClicked={handleSettingClicked} />}
    </StyledWrapper>
  );
});

export default Settings;
