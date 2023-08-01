
import { ReactComponent as CloseIcon } from '../../../../assets/svgs/fail.svg';
import { ReactComponent as Arrow } from '../../../../assets/svgs/arrow_back.svg';
import OperationalModeOptions from "./AvailableSettings/OperationalModeOptions";
import { useEffect, useState } from "react";
import SettingsModesList from "./AvailableSettings/SettingModes";
import CurrencyOptions from "./AvailableSettings/CurrencyOptions";
import LanguageOptions from "./AvailableSettings/LanguageOptions";
import PinOptions from "./AvailableSettings/PinOptions";
import SchemeOptions from "./AvailableSettings/SchemeOptions";
import { SettingModes } from "../utils/settingsReducer";
import styled from "styled-components";
import * as Sv from "../../../../styles/stylevariables";
import { Container, Header } from '../../../shared/DraggableModal/ModalTemplate';



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

const DeviceSettings = ({ hide, onHide }: Props) => {
  
  const menuToggler = (listItem: SettingModes) => setSettingMode(listItem);
  const [settingList, setSettingList] = useState(<></>);
  const [settingMode, setSettingMode] = useState(SettingModes.SETTINGS);
  const [settingHeader, setSettingHeader] = useState('Settings');  

  useEffect(() => {
    switch(settingMode) {
    case SettingModes.SETTINGS:
      setSettingHeader('Settings');
      setSettingList(<SettingsModesList menuToggler={menuToggler}/>);
      break;
    case SettingModes.OPERATIONAL_MODE:
      setSettingHeader('Operational Mode');
      setSettingList(<OperationalModeOptions/>)
      break;
    case SettingModes.CURRENCY:
      setSettingHeader('Currency');
      setSettingList(<CurrencyOptions />)
      break;
    case SettingModes.LANGUAGE:
      setSettingHeader('Default Language');
      setSettingList(<LanguageOptions />)
      break;
    case SettingModes.ASK_FOR_PIN:
      setSettingHeader('Ask for PIN');
      setSettingList(<PinOptions />)
      break;
    case SettingModes.AVAILABLE_SCHEMES:
      setSettingHeader('Supported Schemes');
      setSettingList(<SchemeOptions/>)
      break;
    default :
      null;
    break;
  } 
  }, [settingMode])

return (
<>

<SettingsWrapper $hide={hide}>
<Container> 
<SettingHeader>
<IconContainer onClick={() => menuToggler(SettingModes.SETTINGS)} style={{cursor: 'pointer'}} >{ settingMode !== SettingModes.SETTINGS ? <Arrow  width={11} height={11} /> : null }</IconContainer>
  { settingHeader }
<IconContainer onClick={() => { setSettingMode(SettingModes.SETTINGS); onHide()}} style={{cursor: 'pointer'}}><CloseIcon width={11} height={11} /></IconContainer>
</SettingHeader>
  { settingList }
  </Container> 
</SettingsWrapper>
</>
)

}

export default DeviceSettings;
  