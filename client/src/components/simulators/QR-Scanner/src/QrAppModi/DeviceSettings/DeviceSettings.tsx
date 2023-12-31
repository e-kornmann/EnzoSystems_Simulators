import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import Settings from './AvailableSettings/Settings';
import LanguageOptions from './AvailableSettings/LanguageOptions';
import { QrAppModi } from '../../App';
import { SettingModes } from '../../utils/settingsReducer';
import { StatusOptions } from './AvailableSettings/StatusOptions';

export const SettingsWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '35px',
  height: 'calc(100% - 35px)',
  width: '100%',
  borderRadius: '0 0 5px 5px',
  backgroundColor: theme.colors.background.secondary,
  display: 'grid',
  gridTemplateRows: '1fr auto',
  zIndex: '400',
}));

export const ArrowWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '-23px',
  left: '9px',
  cursor: 'pointer',
  '& > svg': {
    fill: theme.colors.text.primary,
  },
}));

type Props = {
  modusSetterHandler: (modus: QrAppModi) => void;
};

const DeviceSettings = ({ modusSetterHandler }: Props) => {
  const [list, setList] = useState(<></>);
  const [settingMode, setSettingMode] = useState(SettingModes.SETTINGS);
  const menuToggler = (listItem: SettingModes) => setSettingMode(listItem);

  const arrowBackButtonHandler = useCallback(() => {
    modusSetterHandler(QrAppModi.SETTINGS);
    setSettingMode(SettingModes.SETTINGS);
  }, [modusSetterHandler]);

  useEffect(() => {
    switch (settingMode) {
      case SettingModes.SETTINGS:
        modusSetterHandler(QrAppModi.SETTINGS);
        setList(<Settings menuToggler={menuToggler} />);
        break;
      case SettingModes.OPERATIONAL_MODE:
        setList(<StatusOptions arrowBackButtonHandler={arrowBackButtonHandler} modusSetterHandler={modusSetterHandler} />);
        modusSetterHandler(QrAppModi.SET_MODE);
        break;
      case SettingModes.LANGUAGE:
        setList(<LanguageOptions arrowBackButtonHandler={arrowBackButtonHandler} modusSetterHandler={modusSetterHandler} />);
        modusSetterHandler(QrAppModi.SET_LANGUAGE);
        break;
      default:
        modusSetterHandler(QrAppModi.QR_SCANNER);
        break;
    }
  }, [arrowBackButtonHandler, modusSetterHandler, settingMode]);

  return (
    <SettingsWrapper>
         {list}
    </SettingsWrapper>
  );
};

export default DeviceSettings;
