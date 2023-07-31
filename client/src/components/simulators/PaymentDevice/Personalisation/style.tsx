import styled from "styled-components";
import * as Sv from "../../../../styles/stylevariables";
import { Header } from "../PaymentTerminal.styles";

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
  padding: 0 15px;
  justify-content: space-between;
`;

export const List = styled.div`
  grid-row: 2 / 7;
  background-color: ${Sv.lightgray};
  padding: 2px 0;
  display: flex;
  flex-direction: column;
  align-items: 'flex start';
  font-size: 25px;
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
  font-size: 0.65em;
  padding: 10px 20px;
  &:active {
    background-color: ${Sv.enzoLightOrange};
    fill: ${Sv.enzoOrange};
  }
`;

export const Wrap = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
 `;



