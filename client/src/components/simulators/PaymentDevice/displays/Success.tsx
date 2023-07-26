import * as Sv from "../../../../styles/stylevariables";
import SuccessIcon from "../../../shared/svgcomponents/Success";
import { IconContainer, Container, Subline } from "./styles"

const Success = () => {
    return (
      <>
      <Container>
        <IconContainer><SuccessIcon width={100} height={100} fill={Sv.green}/></IconContainer>
        <Subline>Payment accepted</Subline>
      </Container>
      </>
    )
  }
  
  export default Success;