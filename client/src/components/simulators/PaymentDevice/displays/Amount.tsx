
import styled from 'styled-components';
import PriceFormatter from '../../../../utils/priceFormatter'
import FailureIcon from '../../../shared/svgcomponents/Fail';
import {  Container, Mainline, Subline, SublineBottom } from './styles'
import { Status } from '../types/types';

type Props = {
    amount: number | undefined;
    currentState: Status;
}

type IconProp = {
  $show: boolean;
}
const IconContainer = styled.div<IconProp>`
  display: ${(props) => (props.$show ? 'block' : 'none')};
  position: absolute;
  top: 30px;
`
const Amount = ({ amount, currentState }: Props) => {

  let subline: string; 
  switch(currentState) {
    case Status.PIN_ENTRY:
     subline = 'Enter Pin';
     break;
    case Status.WRONG_PIN:
      subline = 'Wrong PIN. Try again.';
      break;
    default :
     subline = 'Present Card'; 
     break;    
  }

  return (
    <Container>
      <IconContainer $show={currentState === Status.WRONG_PIN}><FailureIcon width={30} height={30} /></IconContainer>
      <Subline>Amount:</Subline>
      <Mainline>EUR {PriceFormatter(amount, 'nl-NL')}</Mainline>
      <SublineBottom> 
        {subline} </SublineBottom>
    </Container>
  )
}

export default Amount;