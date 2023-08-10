import * as Sv from "../../../../styles/stylevariables";
import SuccessIcon from "../../../shared/Success";
import styled from "styled-components";
import { MessageContentType, PinTerminalStatus } from "../types";
import { memo } from 'react';
import CrossIcon from "../../../shared/Fail";

export const MessageContainer = styled.div`    
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 0.9em;
    height: 100%;
    width: 100%;
    z-index: 100;
  `;

export const Subline = styled.div`
    font-family: 'Inter', sans-serif;
    font-size: 1.0em;
    font-weight: 500;
    text-align: center; 
    white-space: pre-line; 
    margin: 7px 0;
`;

export const Mainline = styled.div`
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 1.5em;
    line-height: 1.3em;
    color: ${Sv.enzoOrange};
    text-align: center; 
`;

export const WelcomeLine = styled(Mainline)`
    font-weight: 500;
    font-size: 1.8em;
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
    terminalState: PinTerminalStatus;
}

const MessageBlock = ({content, terminalState}: Props) => {
    const { mainline, subline, failicon, successicon } = content;

    return (
      <>
      <MessageContainer>
        { successicon && <IconContainer><SuccessIcon width={53} height={53} fill={Sv.green}/></IconContainer> }
        { failicon && <IconContainer><CrossIcon width={53} height={53} fill={Sv.red}/></IconContainer> }
        { (terminalState === PinTerminalStatus.IDLE) ? <WelcomeLine>{mainline}</WelcomeLine> :  
     <><Mainline>{mainline}</Mainline><Subline>{subline}</Subline> </>
    }
      </MessageContainer>
      </>
    )
  }
  
  export const Message = memo(MessageBlock);