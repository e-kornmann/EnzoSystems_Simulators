
import styled from 'styled-components';
import PriceFormatter from '../../../shared/priceformatter'
import FailureIcon from '../../../shared/svgcomponents/Fail';
import {  Container, Mainline, Subline, SublineBottom } from './styles'
import { Status } from '..';

type Props = {
    amount: number | undefined;
    currentState: Status;
}

type IconProp = {
  $show: boolean;
}
const IconContainer = styled.div<IconProp>`
  display: ${(props) => (props.$show ? 'block' : 'none')};
  postion: absolute;
  top: 30px;
`

const Amount = ({ amount, currentState }: Props) => {

  let subline: string; 
  switch(currentState) {
    case Status.PIN_ENTRY:
     subline = 'Enter Pin';
     break;
    case Status.PIN_FAILURE:
      subline = 'Wrong PIN. Try again.';
      break;
    default :
     subline = 'Present Card'; 
     break;    
  }

  return (
    <Container>
      <IconContainer $show={currentState === Status.PIN_FAILURE}><FailureIcon width={30} height={30} /></IconContainer>
      <Subline>Amount:</Subline>
      <Mainline>EUR {PriceFormatter(amount, 'nl-NL')}</Mainline>
      <SublineBottom> 
        {subline} </SublineBottom>
    </Container>
  )
}

export default Amount;