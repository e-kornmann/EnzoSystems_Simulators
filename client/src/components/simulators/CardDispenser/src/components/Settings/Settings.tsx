import { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
// styled components
import styled from 'styled-components';
import * as S from '../../../local_shared/DraggableModal/ModalTemplate';
// svg images
import { ReactComponent as Arrow } from '../../../local_assets/arrow.svg';
import { ReactComponent as CheckmarkIcon } from '../../../local_assets/success.svg';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
// enums
import DEVICESTATUSOPTIONS from '../../enums/DeviceStatusOptions';
import ActionType from '../../enums/ActionTypes';
// types
import SettingType from '../../types/SettingType';
import APPSETTINGS from '../../enums/AppSettings';
import { SettingContext } from '../../contexts/dispatch/SettingContext';
import STACKSTATUSES from '../../enums/StackStatus';
import BINSTATUSES from '../../enums/BinStatus';
import CARDPOSITIONS from '../../enums/CardPosition';
import { AllOptions } from '../../utils/settingReducer';
import translate from '../../Translations/translate';
import Lang from '../../enums/Lang';

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
  appLanguage: Lang;
  showBinSettings: boolean,
  showStackSettings: boolean
};

const SettingsComponent = ({ clickedBack, appLanguage, showBinSettings, showStackSettings }: SettingsProps) => {
  const appDispatch = useContext(AppDispatchContext);
  const { settingState, settingDispatch } = useContext(SettingContext);
  const [settingIsClicked, setSettingIsClicked] = useState<SettingType | null>(null);

  const settings = useMemo<SettingType[]>(() => [
    { options: Object.values(DEVICESTATUSOPTIONS), type: APPSETTINGS.DEVICE_STATUS },
    { options: Object.values(STACKSTATUSES), type: APPSETTINGS.CARD_STACK },
    { options: Object.values(BINSTATUSES), type: APPSETTINGS.BIN },
    { options: Object.values(CARDPOSITIONS), type: APPSETTINGS.CARD_POSITION },
  ], []);

  // toggle displaying options for this setting
  const handleSettingClicked = useCallback((appsetting: SettingType) => {
    setSettingIsClicked(appsetting);
    appDispatch({ type: ActionType.SET_HEADER_TITLE, payload: appsetting.type });
    appDispatch({ type: ActionType.SHOW_BACK, payload: true });
  }, [appDispatch]);

  // show designated settings if someone clicks on footer buttons
  useEffect(() => {
    if (showBinSettings) {
      handleSettingClicked({ options: Object.values(BINSTATUSES), type: APPSETTINGS.BIN });
    }
    if (showStackSettings) {
      handleSettingClicked({ options: Object.values(STACKSTATUSES), type: APPSETTINGS.CARD_STACK });
    }
  }, [handleSettingClicked, settings, showBinSettings, showStackSettings]);

  // select an option in the currently active setting
  const handleOptionClicked = useCallback((option: AllOptions, setting: SettingType) => {
    if (setting) {
      settingDispatch({ type: setting.type, payload: option });
      if (setting.type === APPSETTINGS.DEVICE_STATUS) {
        settingDispatch({ type: 'STATUS_OPTION_IS_CLICKED', payload: true });
      }
    }
  }, [settingDispatch]);

  useEffect(() => { // Return to Settings menu from an Options list
    if (clickedBack && settingIsClicked) {
      setSettingIsClicked(null);
      appDispatch({ type: ActionType.SET_HEADER_TITLE, payload: 'Settings' });
      appDispatch({ type: ActionType.CLICKED_BACK, payload: false });
    }
  }, [appDispatch, clickedBack, settingDispatch, settingIsClicked]);

  useEffect(() => { // On load, set header to display 'Settings' as title
    appDispatch({ type: ActionType.SET_HEADER_TITLE, payload: 'Settings' });
  }, [appDispatch]);

  return (
    <StyledWrapper>
      {!settingIsClicked && settings.map((appsetting, index) => (
        <S.SharedStyledListButtonWithArrow key={appsetting.type + index} onClick={() => { handleSettingClicked(appsetting); }}>
         {translate(appsetting.type, appLanguage)}<Arrow/>
        </S.SharedStyledListButtonWithArrow>
      ))}
      {settingIsClicked && settingIsClicked.options.map(option => (
        <S.SharedStyledListButton key={option} onClick={() => { handleOptionClicked(option, settingIsClicked); }}>
         {translate(option, appLanguage)}
        { settingState[settingIsClicked.type] === option
        && <CheckmarkIcon width={14} height={11}/> }
        </S.SharedStyledListButton>
      ))}
    </StyledWrapper>
  );
};

export const Settings = memo(SettingsComponent);
