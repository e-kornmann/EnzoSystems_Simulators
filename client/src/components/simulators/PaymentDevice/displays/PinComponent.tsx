
import styled from 'styled-components';
import PriceFormatter from '../../../shared/priceformatter'
import FailureIcon from '../../../shared/svgcomponents/Fail';
import {  Container, Mainline, Subline, SublineBottom } from './styles'

type Props = {
    amount: number | undefined;
    showPinEntry: boolean;
    pinAttempts: number;
}

type IconProp = {
  $show: boolean;
}
const IconContainer = styled.div<IconProp>`
  display: ${(props) => (props.$show ? 'block' : 'none')};
  postion: absolute;
  top: 30px;
`

const PinComponent = ({ amount, showPinEntry, pinAttempts  }: Props) => {

  return (
    <Container>
      <IconContainer $show={pinAttempts > 0}><FailureIcon width={30} height={30} /></IconContainer>
      <Subline>{ pinAttempts > 0 ? 'Wrong PIN' : 'Amount to pay'}</Subline>
      <Mainline>EUR {PriceFormatter(amount, 'nl-NL')}</Mainline>
      <SublineBottom> 
        { showPinEntry ? 'Enter PIN' : 'Present Card'} </SublineBottom>
    </Container>
  )
}

export default PinComponent;