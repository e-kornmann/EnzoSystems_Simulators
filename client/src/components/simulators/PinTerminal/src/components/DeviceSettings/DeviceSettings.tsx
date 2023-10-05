import { memo, useContext, useEffect, useState } from 'react';
// styled components
import styled from 'styled-components';
// contexts
import { AppContext, SettingModes } from '../../utils/settingsReducer';
// svgs
import { ReactComponent as CloseIcon } from '../../../local_assets/close.svg';
import { ReactComponent as Arrow } from '../../../local_assets/arrow_back.svg';
// shared components
import * as S from '../../../local_shared/DraggableModal/ModalTemplate';
// components
import OperationalModeOptions from './AvailableSettings/OperationalModeOptions';
import Settings from './AvailableSettings/Settings';
import { CurrencyOptions } from './AvailableSettings/CurrencyOptions';
import { LanguageOptions } from './AvailableSettings/LanguageOptions';
import { PinOptions } from './AvailableSettings/PinOptions';
import { SchemeOptions } from './AvailableSettings/SchemeOptions';
// translations
import ts from '../../Translations/translations';

type HideProp = {
  $hide: boolean;
};

export const SettingsWrapper = styled.div<HideProp>(({ $hide }) => ({
  display: $hide ? 'none' : 'flex',
  borderRadius: '5px',
  position: 'absolute',
  width: '100%',
  height: '100%',
  zIndex: '400',
  backgroundColor: '#F7F7F7',
  overflow: 'hidden',
}));

type Props = {
  hide: boolean;
  onHide: () => void;
};

const AppSettingsComponent = ({ hide, onHide }: Props) => {
  const { state } = useContext(AppContext);
  const [list, setList] = useState(<></>);
  const [settingMode, setSettingMode] = useState(SettingModes.SETTINGS);
  const menuToggler = (listItem: SettingModes) => setSettingMode(listItem);
  const [heading, setHeading] = useState('Settings');

  useEffect(() => {
    switch (settingMode) {
      case SettingModes.SETTINGS:
        setHeading('Settings');
        setList(<Settings menuToggler={menuToggler}/>);
        break;
      case SettingModes.OPERATIONAL_MODE:
        setHeading(ts('operationalMode', state.language));
        setList(<OperationalModeOptions/>);
        break;
      case SettingModes.CURRENCY:
        setHeading(ts('currency', state.language));
        setList(<CurrencyOptions />);
        break;
      case SettingModes.LANGUAGE:
        setHeading(ts('defaultLanguage', state.language));
        setList(<LanguageOptions />);
        break;
      case SettingModes.ASK_FOR_PIN:
        setHeading(ts('askForPin', state.language));
        setList(<PinOptions />);
        break;
      case SettingModes.AVAILABLE_SCHEMES:
        setHeading(ts('supportedSchemes', state.language));
        setList(<SchemeOptions onHide={onHide}/>);
        break;
      default:
        break;
    }
  }, [onHide, settingMode, state.language]);

  return (
<>

<SettingsWrapper $hide={hide}>
<S.SharedStyledContainer>
<S.SharedStyledHeader>

  <button disabled={settingMode === SettingModes.SETTINGS} onClick={() => menuToggler(SettingModes.SETTINGS)}>
    { settingMode !== SettingModes.SETTINGS && <Arrow width={12} height={12}/> }
  </button>
    { heading }
  <button type="button" onClick={() => { setSettingMode(SettingModes.SETTINGS); onHide(); }}>
    <CloseIcon width={11} height={11} />
  </button>

  </S.SharedStyledHeader>
  { list }
  </S.SharedStyledContainer>
</SettingsWrapper>
</>
  );
};

export const DeviceSettings = memo(AppSettingsComponent);
