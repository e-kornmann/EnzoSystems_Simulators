
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
  width: 13px;
  height: 13px;
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

export const List = styled.div`
  background-color: ${Sv.lightgray};
  padding: 2px 0;
  display: flex;
  flex-direction: column;
  align-items: 'flex start';
  font-size: 1.5em;
  background-color: #F7F7F7;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  height: 100%;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    background: transparent; 
    width: 0.35rem;
  }
  &::-webkit-scrollbar-track {
    width: 0.35rem;
  }
  &::-webkit-scrollbar-thumb {
    background: ${Sv.gray}; 
    border-radius: 5px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${Sv.asphalt}; 
  };
`;

export const Button = styled.button`
  display: flex;
  flex-direction: row;
  cursor: pointer;
  align-items: center;
  justify-content: space-between;
  border-bottom: 0.13em solid ${Sv.lightgray};
  width: 100%;
  height: 40px;
  font-size: 0.55em;
  padding: 11px;
  &:active {
    background-color: ${Sv.enzoLightOrange};
    fill: ${Sv.enzoOrange};
  }
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
      setList(<SettingsModesList menuToggler={menuToggler}/>);
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
      setList(<SchemeOptions/>)
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
<IconContainer onClick={() => menuToggler(SettingModes.SETTINGS)} style={{cursor: 'pointer'}} >{ settingMode !== SettingModes.SETTINGS ? <Arrow  width={11} height={11} /> : null }</IconContainer>
  { heading }
<IconContainer onClick={() => { setSettingMode(SettingModes.SETTINGS); onHide()}} style={{cursor: 'pointer'}}><CloseIcon width={11} height={11} /></IconContainer>
</SettingHeader>
  { list }
  </Container> 
</SettingsWrapper>
</>
)

}

export default AppSettings;
  