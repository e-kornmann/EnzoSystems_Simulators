
import styled from 'styled-components';
import PriceFormatter from '../../../shared/priceformatter'
import FailureIcon from '../../../shared/svgcomponents/Fail';
import { Container, Mainline, Subline } from './styles'

type Props = {
    amount: number | undefined;
}

const IconContainer = styled.div`
  postion: absolute;
  top: 30px;
`



const AmountFail = ({ amount }: Props) => {
  return (
    <Container>
      <IconContainer><FailureIcon width={30} height={30} /></IconContainer>
      <Subline>Amount to pay</Subline>
      <Mainline>EUR {PriceFormatter(amount, 'nl-NL')}</Mainline>
      <Subline>Enter PIN</Subline>
    </Container>
  )
}

export default AmountFail;