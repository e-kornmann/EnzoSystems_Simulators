import * as Sv from "../../../../styles/stylevariables";
import FailureIcon from "../../../shared/svgcomponents/Fail";
import SuccessIcon from "../../../shared/svgcomponents/Success";
import styled from "styled-components";
import { MessageContentType } from "../types/types";


export const MessageContainer = styled.div`    
     display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    z-index: 100;
  `;

export const Subline = styled.div`
    font-family: 'Inter', sans-serif;
    font-size: 0.7em;
    font-weight: 500;
    text-align: center; 
    white-space: pre-line; 
`;

export const SublineBottom = styled(Subline)`
    font-size: 0.9em;
`;

export const Mainline = styled.div`
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 1.2em;
    line-height: 0.8em;
    color: ${Sv.enzoOrange};
    text-align: center; 
`;

export const WelcomeLine = styled(Mainline)`
    font-weight: 500;
`;

export const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    margin-bottom: 15px;
`;

type Props = {
    content: MessageContentType;
}



const Message = ({content}: Props) => {
    const {mainline, subline, failicon, successicon} = content

    return (
      <>
      <MessageContainer>
        {(successicon) && (<IconContainer><SuccessIcon width={73} height={73} fill={Sv.green}/></IconContainer>)}
        {(failicon) && (<IconContainer><FailureIcon width={73} height={73} /></IconContainer>)}
        {(mainline !== undefined) && ( <Mainline>{mainline}</Mainline>)}
        {(subline !== undefined) && ( <Subline>{subline}</Subline>)}
      </MessageContainer>
      </>
    )
  }
  
  export default Message;