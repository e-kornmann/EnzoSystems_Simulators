import { IconContainer, Container, Subline } from "./styles"
import { ReactComponent as SuccessIcon } from '../../../../assets/svgs/success.svg';


const Success = () => {
    return (
      <>
      <Container>
        <IconContainer><SuccessIcon /></IconContainer>
        <Subline>Payment accepted</Subline>
      </Container>
      </>
    )
  }
  
  export default Success;