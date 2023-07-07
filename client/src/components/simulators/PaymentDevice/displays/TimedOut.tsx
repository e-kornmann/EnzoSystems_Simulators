import { Container, Mainline, Subline } from "./styles"

const TimedOut = () => {
  return (
    <>
    <Container>
      <Subline>Payment timed out</Subline>
      <Mainline>Nothing paid</Mainline>
    </Container>
    </>
  )
}

export default TimedOut