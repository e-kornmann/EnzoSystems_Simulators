
import PriceFormatter from '../../../shared/priceformatter'
import { Container, Mainline, Subline } from './styles'

type Props = {
    amount: number | undefined;
}

const AmountPresent = ({ amount }: Props) => {
  return (
    <Container>
      <Subline>Amount to pay</Subline>
      <Mainline>EUR {PriceFormatter(amount, 'nl-NL')}</Mainline>
      <Subline>PresentCard</Subline>
    </Container>
  )
}

export default AmountPresent;