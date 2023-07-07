
import PriceFormatter from '../../../shared/priceformatter'
import { Container, Mainline, Subline } from './styles'

type Props = {
    amount: number
}

const Amount = ({ amount }: Props) => {
  return (
    <Container>
      <Subline>Amount to pay</Subline>
      <Mainline>EUR {PriceFormatter(amount, 'nl-NL')}</Mainline>
      <Subline>Present Card</Subline>
    </Container>
  )
}

export default Amount