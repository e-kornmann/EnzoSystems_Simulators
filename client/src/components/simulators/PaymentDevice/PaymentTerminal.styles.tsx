import styled from 'styled-components';
import * as Sv from '../../../styles/stylevariables';

const Container = styled.main`
  background-color: white;
  font-family: 'Inter', sans-serif;
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-rows: 45px 1fr;
`;

const Header = styled.div`
  fill: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: ${Sv.enzoOrange};
  font-weight: 500;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  fill: black;
`;

const Content = styled.div`
  padding: 0 10px 55px;
  display: flex;
  flex-direction: column;
  font-size: 17px;
  background-color: #EBEBEB;
  overflow-y:unset;
`;

const TimeRibbon = styled.div`
  position: absolute;
  top: 35px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-variant-numeric: tabular-nums;
  font-size: 13px;
  font-weight: 500;
  padding: 15px 20px 5px;
  background-color: transparent;
`;

const PayOptions = styled.div`
  width: 73px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3px;
`;

const Footer = styled.div`
  position: absolute;
  width: 100%;
  bottom: 0px;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px 15px;
  background-color: white;
  border-radius: 0 0 5px 5px;	
`;

const SettingsButton = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 23px;
  height: 23px;
  margin-top: 4px;
  `;

const PayProviderBorder = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 30px;
    border-radius: 3px;
    box-shadow: ${Sv.gray} 0px 1px 2px;
    margin-top: -3px;
    border-top: 1px solid ${Sv.lightgray};
  `

export { 
 Container,
 Header,
 Footer,
 PayOptions,
 TimeRibbon,
 Content,
 SettingsButton,
 PayProviderBorder,
 }
 