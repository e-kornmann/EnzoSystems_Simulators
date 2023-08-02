

import { useContext } from 'react';
import { ReactComponent as Arrow } from '../../../../../assets/svgs/arrow.svg';
import * as Sv from '../../../../../styles/stylevariables';
import ts from '../../Translations/translations';
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import styled from "styled-components";


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
  font-size: 0.6em;
  padding: 8px 11px;
  &:active {
    background-color: ${Sv.enzoLightOrange};
    fill: ${Sv.enzoOrange};
  }
`;

type Props = {
  menuToggler: (listItem: SettingModes) => void;
}

const SettingsModesList = ({menuToggler}: Props) => {
  const { state } = useContext(AppContext);
  
  return (
<>
<List>
  <Button onClick={() => menuToggler(SettingModes.OPERATIONAL_MODE)} >{ts('operationalMode', state.language)}<Arrow height={11} /></Button>
  <Button onClick={() => menuToggler(SettingModes.CURRENCY)} >{ts('currency', state.language)}<Arrow height={11}/></Button>
  <Button onClick={() => menuToggler(SettingModes.LANGUAGE)} >{ts('defaultLanguage', state.language)}<Arrow height={11}/></Button>
  <Button onClick={() => menuToggler(SettingModes.ASK_FOR_PIN)} >{ts('askForPin', state.language)}<Arrow height={11}/></Button>
  <Button onClick={() => menuToggler(SettingModes.AVAILABLE_SCHEMES)} >{ts('supportedSchemes', state.language)}<Arrow height={11}/></Button>
</List>
</>
)}

export default SettingsModesList;