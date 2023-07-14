import { Container, IconContainer, Subline } from "./styles"
import FailureIcon from "../../../shared/svgcomponents/Fail";

const Failure = () => 

       <Container>
        <IconContainer><FailureIcon width={50} height={50} /></IconContainer>
        <Subline>Payment failed</Subline>
      </Container>
 
  
  export default Failure;