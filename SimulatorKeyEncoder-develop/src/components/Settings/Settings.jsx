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

const StyledWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin: 0 10%;
  row-gap: 10px;
  width: 80%;
`;

const Settings = ({ clickedBack, clickedCross, deviceStatus }) => {
  const appDispatch = useContext(AppDispatchContext);
  const [settingClicked, setSettingClicked] = useState(false);

  const settings = useMemo(() => { // available settings
    return [
      {
        currentValue: deviceStatus,
        options: [DeviceStatuses.CONNECTED, DeviceStatuses.DISCONNECTED, DeviceStatuses.OUT_OF_ORDER],
        title: 'Device Status',
        type: SettingsTypes.DEVICE_STATUS
      }
    ];
  }, [deviceStatus]);

  const handleSettingClicked = useCallback((setting) => { // toggle displaying options for this specific setting
    setSettingClicked(setting);
    appDispatch({ type: 'set-header-title', payload: setting.title });
    appDispatch({ type: 'show-back', payload: true });
  }, []);

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

  useEffect(() => { // Close Settings
    if (clickedCross) {
      appDispatch({ type: 'clicked-cross', payload: false });
      appDispatch({ type: 'toggle-settings' });
    }
  }, [clickedCross]);

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
};

export default memo(Settings);
