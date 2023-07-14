
import PriceFormatter from '../../../shared/priceformatter'
import { Container, Mainline, Subline } from './styles'

type Props = {
    amount: number | undefined;
}

const AmountPinEntry = ({ amount }: Props) => {
  return (
    <Container>
      <Subline>Amount to pay</Subline>
      <Mainline>EUR {PriceFormatter(amount, 'nl-NL')}</Mainline>
      <Subline>Enter PIN</Subline>
    </Container>
  )
}

export default AmountPinEntry;