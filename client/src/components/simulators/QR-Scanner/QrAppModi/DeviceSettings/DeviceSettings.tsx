import OperationalModeOptions from "./AvailableSettings/OperationalModeOptions";
import { useCallback, useEffect, useState } from "react";
import Settings from "./AvailableSettings/Settings";

import LanguageOptions from "./AvailableSettings/LanguageOptions";
import styled from "styled-components";

import { QrAppModi } from '../..';
import { SettingModes } from '../../utils/settingsReducer';
import * as Sv from '../../../../../styles/stylevariables';



export const SettingsWrapper = styled.div`
  position: absolute;
  top: 35px;
  height: calc(100% - 35px);
  width: 100%;
  border-radius: 0 0 5px 5px;
  background-color: ${Sv.appBackground};
  display: grid;
  grid-template-rows: 1fr auto; 
  z-index: 400;
`;

export const ArrowWrapper = styled.div`
  position: absolute;
  top: -23px;
  left: 9px;
  cursor: pointer;
  & > svg {
    fill: ${Sv.asphalt}; 
  }
`

type Props = {
  modusSetterHandler: (modus: QrAppModi) => void;

};

const DeviceSettings = ({ modusSetterHandler }: Props) => {
  const menuToggler = (listItem: SettingModes) => setSettingMode(listItem);
  const [list, setList] = useState(<></>);
  const [settingMode, setSettingMode] = useState(SettingModes.SETTINGS);
  
  
  const arrowBackButtonHandler = useCallback(() => {
    modusSetterHandler(QrAppModi.SETTINGS);
    setSettingMode(SettingModes.SETTINGS);
  }, [modusSetterHandler])




  useEffect(() => {
    switch (settingMode) {
      case SettingModes.SETTINGS:
        modusSetterHandler(QrAppModi.SETTINGS);
        setList(<Settings menuToggler={menuToggler} />);
        break;
      case SettingModes.OPERATIONAL_MODE:
        setList(<OperationalModeOptions arrowBackButtonHandler={arrowBackButtonHandler} />);
        modusSetterHandler(QrAppModi.SET_MODE);
        break;
      case SettingModes.LANGUAGE:
        setList(<LanguageOptions arrowBackButtonHandler={arrowBackButtonHandler} />)
        modusSetterHandler(QrAppModi.SET_LANGUAGE);
        break;
      case SettingModes.HIDE: 
        modusSetterHandler(QrAppModi.QR_SCANNER);
        break;
      default:
        modusSetterHandler(QrAppModi.QR_SCANNER);
        break;
    }
  }, [arrowBackButtonHandler, modusSetterHandler, settingMode])

  return (

    <SettingsWrapper>
         {list}
    </SettingsWrapper>
  )

}

export default DeviceSettings;
