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
  grid-template-rows: 60px 25px 620px 5px 30px;
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


type Props = {
  $aligntop : boolean;
}



const TextBox = styled.div<Props>`
  margin-bottom
  grid-row: 3 / 4;
  padding: 12px 15px 100px;
  display: flex;
  justify-content: center;
  align-items: ${(props) => (props.$aligntop ? 'flex start' : 'center')};
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
  padding: 15px 20px 5px;
  background-color: #F7F7F7;
`;

const PayOptions = styled.div`
  width: 75px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Footer = styled(TimeRibbon)`
  grid-row: 5 / 6;
  padding: 15px 20px 15px 22px;
`;

const StateButton = styled(Button)`
  position: absolute;
  left: -250px;
  bottom: 130px;
  width: 200px;
`;

  
export { 
 Container,
 Header,
 Footer,
 PayOptions,
 TimeRibbon,
 StateButton,
 TextBox,
 }