import * as Sv from "../../../../styles/stylevariables";
import SuccessIcon from "../../../shared/svgcomponents/Success";
import { MessageContainer, Subline, IconContainer } from "./Message";


const Success = () => {
    return (
      <>
      <MessageContainer>
        <IconContainer><SuccessIcon width={100} height={100} fill={Sv.green}/></IconContainer>
        <Subline>Payment accepted</Subline>
      </MessageContainer>
      </>
    )
  }
  
  export default Success;