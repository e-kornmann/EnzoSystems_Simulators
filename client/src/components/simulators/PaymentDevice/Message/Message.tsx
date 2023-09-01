import styled from 'styled-components';
import { memo } from 'react';
import * as Sv from '../../../../styles/stylevariables';
import { MessageContentType, PinTerminalStatus } from '../types';
import { SharedSuccesOrFailIcon } from '../../../shared/CheckAndCrossIcon';

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
};

const MessageBlock = ({ content, terminalState }: Props) => {
  const {
    mainline, subline, checkOrCrossIcon,
  } = content;

  return (
    <>
      <MessageContainer>

      <IconContainer>
      <SharedSuccesOrFailIcon checkOrCrossIcon={checkOrCrossIcon} width={53} height={53} />
      </IconContainer>
        {/* {successicon
          && <IconContainer>
            <SharedSuccesOrFailIcon CheckOrCrossIcon={CheckOrCrossIcon} width={53} height={53} />
          </IconContainer>}
        {failicon
          && <IconContainer>
            <SharedSuccesOrFailIcon isFailed={true} width={53} height={53} />
          </IconContainer>} */}

        {(terminalState === PinTerminalStatus.IDLE) ? <WelcomeLine>{mainline}</WelcomeLine>
          : <><Mainline>{mainline}</Mainline><Subline>{subline}</Subline> </>

        }
      </MessageContainer>
    </>
  );
};

export const Message = memo(MessageBlock);
