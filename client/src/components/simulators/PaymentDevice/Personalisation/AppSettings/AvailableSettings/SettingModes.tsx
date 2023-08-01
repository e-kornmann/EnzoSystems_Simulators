

import { ReactComponent as Arrow } from '../../../../../../assets/svgs/arrow.svg';
import * as Sv from '../../../../../../styles/stylevariables';
import { SettingModes } from '../../../utils/settingsReducer';
import styled from "styled-components";


export const List = styled.div`
  grid-row: 2 / 7;
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
  return (
<>
<List>
  <Button onClick={() => menuToggler(SettingModes.OPERATIONAL_MODE)} >Operational Mode<Arrow/></Button>
  <Button onClick={() => menuToggler(SettingModes.CURRENCY)} >Currency<Arrow/></Button>
  <Button onClick={() => menuToggler(SettingModes.LANGUAGE)} >Default Language<Arrow/></Button>
  <Button onClick={() => menuToggler(SettingModes.ASK_FOR_PIN)} >Ask for PIN<Arrow/></Button>
  <Button onClick={() => menuToggler(SettingModes.AVAILABLE_SCHEMES)} >Supported Schemes<Arrow/></Button>
</List>
</>
)}

export default SettingsModesList;