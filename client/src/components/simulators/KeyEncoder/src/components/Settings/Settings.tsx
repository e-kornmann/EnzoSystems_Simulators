import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
// styled components
import styled from 'styled-components';
import * as S from '../../../local_shared/DraggableModal/ModalTemplate';
// svg images
import { ReactComponent as Arrow } from '../../../images/arrow.svg';
import { ReactComponent as CheckmarkIcon } from '../../../images/success.svg';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
// enums
import DeviceStatusOptions from '../../enums/DeviceStatusOptions';
import SettingsTypes from '../../enums/SettingsTypes';
import ActionType from '../../enums/ActionTypes';
// types
import SettingType from '../../types/SettingType';

const StyledWrapper = styled('div')({
  padding: '2px 0',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflowY: 'scroll',
});

type SettingsProps = {
  clickedBack: boolean,
  operationalState: DeviceStatusOptions
};

const SettingsComponent = ({ clickedBack, operationalState }: SettingsProps) => {
  const appDispatch = useContext(AppDispatchContext);
  const [settingIsClicked, setSettingClicked] = useState<SettingType | null>(null);

  const settings = useMemo(() => [
    {
      currentValue: operationalState,
      options: [DeviceStatusOptions.CONNECTED, DeviceStatusOptions.DISCONNECTED, DeviceStatusOptions.OUT_OF_ORDER],
      title: 'Device status',
      type: SettingsTypes.DEVICE_STATUS,
    },
  ], [operationalState]);

  const handleSettingClicked = useCallback((setting: SettingType) => { // toggle displaying options for this setting
    setSettingClicked(setting);
    appDispatch({ type: ActionType.SET_HEADER_TITLE, payload: setting.title });
    appDispatch({ type: ActionType.SHOW_BACK, payload: true });
  }, [appDispatch]);

  const handleOptionClicked = useCallback((option: DeviceStatusOptions, setting: SettingType) => { // select an option in the currently active setting
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
    if (clickedBack && settingIsClicked) {
      setSettingClicked(null);
      appDispatch({ type: ActionType.SET_HEADER_TITLE, payload: 'Settings' });
      appDispatch({ type: ActionType.CLICKED_BACK, payload: false });
    }
  }, [appDispatch, clickedBack, settingIsClicked]);

  useEffect(() => { // On load, set header to display 'Settings' as title
    appDispatch({ type: ActionType.SET_HEADER_TITLE, payload: 'Settings' });
  }, [appDispatch]);

  return (
    <StyledWrapper>
      {!settingIsClicked && settings.map(setting => (
       <S.SharedStyledListButtonWithArrow key={setting.type} onClick={() => { handleSettingClicked(setting); }}>
       {setting.title} <Arrow />
     </S.SharedStyledListButtonWithArrow>
      ))}
      {settingIsClicked && settingIsClicked.options.map(option => (
        <S.SharedStyledListButton key={option} onClick={() => { handleOptionClicked(option, settingIsClicked); }}>
        {option}
        { settingIsClicked.currentValue === option
        && <CheckmarkIcon width={14} height={11} /> }
        </S.SharedStyledListButton>
      ))}
    </StyledWrapper>
  );
};

export const Settings = memo(SettingsComponent);
