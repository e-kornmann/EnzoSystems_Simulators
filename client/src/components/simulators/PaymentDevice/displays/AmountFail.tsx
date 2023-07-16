
import styled from 'styled-components';
import PriceFormatter from '../../../shared/priceformatter'
import FailureIcon from '../../../shared/svgcomponents/Fail';
import { Container, Mainline, Subline } from './styles'

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



const AmountFail = ({ amount, showPinEntry, pinAttempts  }: Props) => {
  return (
    <Container>
      <IconContainer $show={pinAttempts > 0}><FailureIcon width={30} height={30} /></IconContainer>
      <Subline>Amount to pay</Subline>
      <Mainline>EUR {PriceFormatter(amount, 'nl-NL')}</Mainline>
      <Subline> 
        { showPinEntry ? 'Enter PIN' : 'Present Card'} </Subline>
    </Container>
  )
}

export default AmountFail;