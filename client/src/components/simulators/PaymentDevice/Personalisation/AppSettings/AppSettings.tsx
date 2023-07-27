
import * as S from "../../styles";
import { ReactComponent as CloseIcon } from '../../../../../assets/svgs/fail.svg';
import { ReactComponent as Arrow } from '../../../../../assets/svgs/arrow_back.svg';
import { IconContainer, SettingHeader, SettingsWrapper } from "../style";
import OperationalModeOptions from "./AvailableSettings/OperationalModeOptions";
import { useEffect, useState } from "react";
import SettingsList from "./SettingsList";
import CurrencyOptions from "./AvailableSettings/CurrencyOptions";
import LanguageOptions from "./AvailableSettings/LanguageOptions";
import PinOptions from "./AvailableSettings/PinOptions";
import SchemeOptions from "./AvailableSettings/SchemeOptions";
import { SettingModes } from "../../utils/settingsReducer";

type Props = {
  hide: boolean;
  onHide: () => void;
};

const AppSettings = ({ hide, onHide }: Props) => {
  
  const menuToggler = (listItem: SettingModes) => setSettingMode(listItem);
  const [buttons, setButtons] = useState(<></>);
  const [settingMode, setSettingMode] = useState(SettingModes.SETTINGS);
  const [heading, setHeading] = useState('Settings');  

  useEffect(() => {
    switch(settingMode) {
    case SettingModes.SETTINGS:
      setHeading('Settings');
      setButtons(<SettingsList menuToggler={menuToggler}/>);
      break;
    case SettingModes.OPERATIONAL_MODE:
      setHeading('Operational Mode');
      setButtons(<OperationalModeOptions/>)
      break;
    case SettingModes.CURRENCY:
      setHeading('Currency');
      setButtons(<CurrencyOptions />)
      break;
    case SettingModes.LANGUAGE:
      setHeading('Default Language');
      setButtons(<LanguageOptions />)
      break;
    case SettingModes.ASK_FOR_PIN:
      setHeading('Ask for PIN');
      setButtons(<PinOptions />)
      break;
    case SettingModes.AVAILABLE_SCHEMES:
      setHeading('Supported Schemes');
      setButtons(<SchemeOptions/>)
      break;
    default :
      null;
    break;
  } 
  }, [settingMode])

return (
<>

<SettingsWrapper $hide={hide}>
<S.Container> 
<SettingHeader>
<IconContainer onClick={() => menuToggler(SettingModes.SETTINGS)} style={{cursor: 'pointer'}} >{ settingMode !== SettingModes.SETTINGS ? <Arrow /> : null }</IconContainer>
  { heading }
<IconContainer onClick={() => { setSettingMode(SettingModes.SETTINGS); onHide()}} style={{cursor: 'pointer'}}><CloseIcon width={16} height={16} /></IconContainer>
</SettingHeader>
  { buttons }
</S.Container>
</SettingsWrapper>
</>
)

}

export default AppSettings;
  