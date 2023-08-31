
import { ReactComponent as CloseIcon } from '../../../../assets/svgs/fail.svg'
import { ReactComponent as Arrow } from '../../../../assets/svgs/arrow_back.svg';
import OperationalModeOptions from "./AvailableSettings/OperationalModeOptions";
import { useContext, useEffect, useState } from "react";
import Settings from "./AvailableSettings/Settings";
import CurrencyOptions from "./AvailableSettings/CurrencyOptions";
import LanguageOptions from "./AvailableSettings/LanguageOptions";
import PinOptions from "./AvailableSettings/PinOptions";
import { SchemeOptions } from "./AvailableSettings/SchemeOptions";
import { AppContext, SettingModes } from "../utils/settingsReducer";
import styled from "styled-components";
import { Container, Header } from '../../../shared/DraggableModal/ModalTemplate';
import ts from '../Translations/translations';


type HideProp = {
  $hide: boolean;
};

export const SettingsWrapper = styled.div<HideProp>`
  display: ${(props) => (props.$hide ? 'none' : 'flex')};
  border-radius: 5px;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 400;
  background-color: #F7F7F7;
  overflow: hidden;
`;

export const SettingHeader = styled(Header)`  
  padding: 0 8px 0 9px;
  justify-content: space-between;
`;

type Props = {
  hide: boolean;
  onHide: () => void;
};

const AppSettings = ({ hide, onHide }: Props) => {
  const { state } = useContext(AppContext);
  const menuToggler = (listItem: SettingModes) => setSettingMode(listItem);
  const [list, setList] = useState(<></>);
  const [settingMode, setSettingMode] = useState(SettingModes.SETTINGS);
  const [heading, setHeading] = useState('Settings');  

  useEffect(() => {
    switch(settingMode) {
    case SettingModes.SETTINGS:
      setHeading('Settings');
      setList(<Settings menuToggler={menuToggler}/>);
      break;
    case SettingModes.OPERATIONAL_MODE:
      setHeading(ts('operationalMode', state.language));
      setList(<OperationalModeOptions/>)
      break;
    case SettingModes.CURRENCY:
      setHeading(ts('currency', state.language));
      setList(<CurrencyOptions />)
      break;
    case SettingModes.LANGUAGE:
      setHeading(ts('defaultLanguage', state.language));
      setList(<LanguageOptions />)
      break;
    case SettingModes.ASK_FOR_PIN:
      setHeading(ts('askForPin', state.language));
      setList(<PinOptions />)
      break;
    case SettingModes.AVAILABLE_SCHEMES:
      setHeading(ts('supportedSchemes', state.language));
      setList(<SchemeOptions onHide={onHide}/>)
      break;
    default :
      null;
    break;
  } 
  }, [onHide, settingMode, state.language])

return (
<>

<SettingsWrapper $hide={hide}>
<Container> 
<SettingHeader>
  <div>
  { settingMode !== SettingModes.SETTINGS && <Arrow width={12} height={12} onClick={() => menuToggler(SettingModes.SETTINGS)} style={{ top: '2px'}}/>  }
  </div>
  { heading }
  <CloseIcon width={11} height={11} onClick={() => { setSettingMode(SettingModes.SETTINGS); onHide()}} />
</SettingHeader>
  { list }
  </Container> 
</SettingsWrapper>
</>
)

}

export default AppSettings;
  