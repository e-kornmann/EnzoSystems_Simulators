import { Container, IconContainer, Subline } from "./styles"
import FailureIcon from "../../../shared/svgcomponents/Fail";






const NotConnected = () => {

  const errorMessage = 'Unable to connect'



  return (

    <Container>
      <IconContainer><FailureIcon width={73} height={73} /></IconContainer>
      <Subline>{errorMessage}</Subline>
    </Container>

  )
};


export default NotConnected;