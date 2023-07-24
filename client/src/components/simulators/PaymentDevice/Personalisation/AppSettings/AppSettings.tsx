
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
import { AllAppSettings, SettingModes, SettingsAction } from "../../utils/settingsReducer";



type Props = {
  hide: boolean;
  onHide: () => void;
  state: AllAppSettings; 
  dispatch: React.Dispatch<SettingsAction>
};


const AppSettings = ({ hide, onHide, state, dispatch }: Props) => {
  
  const menuToggler = (listItem: SettingModes) => setSettingMode(listItem);
  const [buttons, setButtons] = useState(<></>);
  const [settingMode, setSettingMode] = useState(SettingModes.SETTINGS);
  const [heading, setHeading] = useState('Settings');  

  useEffect(() => {
    switch(settingMode) {
    case SettingModes.SETTINGS:
      setHeading('Settings');
      setButtons(<SettingsList menuToggler={menuToggler} />);
      break;
    case SettingModes.OPERATIONAL_MODE:
      setHeading('Operational Mode');
      setButtons(<OperationalModeOptions state={state} dispatch={dispatch} />)
      break;
    case SettingModes.CURRENCY:
      setHeading('Currency');
      setButtons(<CurrencyOptions state={state} dispatch={dispatch} />)
      break;
    case SettingModes.LANGUAGE:
      setHeading('Default Language');
      setButtons(<LanguageOptions state={state} dispatch={dispatch}/>)
      break;
    case SettingModes.ASK_FOR_PIN:
      setHeading('Ask for PIN');
      setButtons(<PinOptions state={state} dispatch={dispatch}/>)
      break;
    case SettingModes.SCHEMES:
      setHeading('Supported Schemes');
      setButtons(<SchemeOptions/>)
      break;
    default :
      null;
    break;
  } 
  }, [dispatch, settingMode, state])

return (
<>

<SettingsWrapper $hide={hide}>
<S.Container> 
<SettingHeader>
<IconContainer>{ settingMode !== SettingModes.SETTINGS ? <Arrow onClick={() => menuToggler(SettingModes.SETTINGS)} style={{cursor: 'pointer'}} /> : null }</IconContainer>
  { heading }
<IconContainer style={{cursor: 'pointer'}}><CloseIcon width={16} height={16} onClick={() => { setSettingMode(SettingModes.SETTINGS); onHide()}} style={{cursor: 'pointer'}} /></IconContainer>
</SettingHeader>
{ buttons }
</S.Container>
</SettingsWrapper>
</>
)

}

export default AppSettings;
