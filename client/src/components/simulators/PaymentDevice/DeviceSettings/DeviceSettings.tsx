
import { ReactComponent as CloseIcon } from '../../../../assets/svgs/fail.svg';
import { ReactComponent as Arrow } from '../../../../assets/svgs/arrow_back.svg';
import OperationalModeOptions from "./AvailableSettings/OperationalModeOptions";
import { useContext, useEffect, useState } from "react";
import SettingsModesList from "./AvailableSettings/SettingModes";
import CurrencyOptions from "./AvailableSettings/CurrencyOptions";
import LanguageOptions from "./AvailableSettings/LanguageOptions";
import PinOptions from "./AvailableSettings/PinOptions";
import SchemeOptions from "./AvailableSettings/SchemeOptions";
import { AppContext, SettingModes } from "../utils/settingsReducer";
import styled from "styled-components";
import * as Sv from "../../../../styles/stylevariables";
import { Container, Header } from '../../../shared/DraggableModal/ModalTemplate';
import ts from '../Translations/translations';

export const IconContainer = styled.div`
  fill: ${Sv.black};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 19px;
  height: 19px;
  `;

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
  const [buttons, setButtons] = useState(<></>);
  const [settingMode, setSettingMode] = useState(SettingModes.SETTINGS);
  const [heading, setHeading] = useState('Settings');  

  useEffect(() => {
    switch(settingMode) {
    case SettingModes.SETTINGS:
      setHeading('Settings');
      setButtons(<SettingsModesList menuToggler={menuToggler}/>);
      break;
    case SettingModes.OPERATIONAL_MODE:
      setHeading(ts('operationalMode', state.language));
      setButtons(<OperationalModeOptions/>)
      break;
    case SettingModes.CURRENCY:
      setHeading(ts('currency', state.language));
      setButtons(<CurrencyOptions />)
      break;
    case SettingModes.LANGUAGE:
      setHeading(ts('defaultLanguage', state.language));
      setButtons(<LanguageOptions />)
      break;
    case SettingModes.ASK_FOR_PIN:
      setHeading(ts('askForPin', state.language));
      setButtons(<PinOptions />)
      break;
    case SettingModes.AVAILABLE_SCHEMES:
      setHeading(ts('supportedSchemes', state.language));
      setButtons(<SchemeOptions/>)
      break;
    default :
      null;
    break;
  } 
  }, [settingMode, state.language])

return (
<>

<SettingsWrapper $hide={hide}>
<Container> 
<SettingHeader>
<IconContainer onClick={() => menuToggler(SettingModes.SETTINGS)} style={{cursor: 'pointer'}} >{ settingMode !== SettingModes.SETTINGS ? <Arrow  width={13} height={13} /> : null }</IconContainer>
  { heading }
<IconContainer onClick={() => { setSettingMode(SettingModes.SETTINGS); onHide()}} style={{cursor: 'pointer'}}><CloseIcon width={13} height={13} /></IconContainer>
</SettingHeader>
  { buttons }
  </Container> 
</SettingsWrapper>
</>
)

}

export default AppSettings;
  