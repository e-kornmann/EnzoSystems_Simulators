import styled from 'styled-components';
import * as Sv from '../../shared/stylevariables';
import { Button } from '../../shared/buttons';


const Container = styled.main`
  background-color: white;
  font-family: 'Inter', sans-serif;
  display: grid;
  width: 360px;
  height: 760px;
  column-gap: 10px;
  grid-template-rows: 60px 25px 500px 45px;
  border-radius: 10px;
`;

const Header = styled.div`
  grid-row: 1 / 2;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  color: ${Sv.enzoOrange};
  font-weight: 500;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const TextBox = styled.div`
  grid-row: 3 / 4;
  padding: 12px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  background-color: #F7F7F7;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

const TimeRibbon = styled.div`
  grid-row: 2 / 3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-variant-numeric: tabular-nums;
  font-size: 13px;
  font-weight: 500;
  padding: 15px 15px 5px;
  background-color: #F7F7F7;
`;

const StateButton = styled(Button)`
  position: absolute;
  left: -250px;
  bottom: 130px;
  width: 200px;
`;

const ButtonContainer = styled.div`
  position: absolute; 
  bottom: 100px;
  display: grid; 
  grid-template-columns: 1fr 1fr 1fr; 
  grid-template-rows: 1fr 1fr 1fr 1fr 1fr; 
  gap: 50px 20px; 
  grid-template-areas: 
    "one two three"
    "four five six"
    "seven eight nine"
    "bl1 zero bl2"
    "stop correct ok"; 
  width: 360px;
  height: 500px;
  padding: 30px;
`;

const Pads = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${Sv.black};
  border-radius: 150px;
  font-weight: 600;
  &:active {
    border: 5px solid #17121232;
  }
`;

const StopButton = styled(Pads)`
  grid-area: stop; 
  background: ${Sv.red};
`;

const OkButton = styled(Pads)`
  grid-area: ok; 
  background: ${Sv.green};
`;

const CorrectButton = styled(Pads)`
  grid-area: correct; 
  background: ${Sv.yellow};
`;

const NrButton  = styled(Pads)`
  display: none;
  grid-area: one; 
  background: ${Sv.enzoOrange};
  font-size: 25px;
`;
  
export { 
 Container,
 Header,
 TimeRibbon,
 StateButton,
 TextBox,
 ButtonContainer,
 StopButton,
 OkButton,
 CorrectButton,
 NrButton,
 }