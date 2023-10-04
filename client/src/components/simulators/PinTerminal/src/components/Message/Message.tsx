import styled from 'styled-components';
import { memo } from 'react';
import * as Sv from '../../../../styles/stylevariables';
import { MessageContentType, OPSTATE } from '../../types';
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
    padding-bottom: 20%;
  `;

export const Subline = styled.div`
    font-family: 'Inter', sans-serif;
    font-size: 0.9em;
    font-weight: 500;
    text-align: center; 
    white-space: pre-line; 
    margin: 7px 0;
`;

export const Mainline = styled.div`
    font-family: 'Inter', sans-serif;
    font-weight: 600;
    font-size: 1.3em;
    line-height: 1.3em;
    color: ${Sv.enzoOrange};
    text-align: center; 
`;

export const WelcomeLine = styled(Mainline)`
    font-weight: 500;
    font-size: 1.5em;
`;

export const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    margin-bottom: 25px;
`;

type Props = {
  content: MessageContentType;
  operationalState: OPSTATE;
};

const MessageBlock = ({ content, operationalState }: Props) => {
  const {
    mainline, subline, checkOrCrossIcon,
  } = content;

  return (
    <>
      <MessageContainer>

      <IconContainer>
      <SharedSuccesOrFailIcon checkOrCrossIcon={checkOrCrossIcon} width={38} height={38} />
      </IconContainer>
        {(operationalState === OPSTATE.DEVICE_IDLE) ? <WelcomeLine>{mainline}</WelcomeLine>
          : <><Mainline>{mainline}</Mainline><Subline>{subline}</Subline> </>

        }
      </MessageContainer>
    </>
  );
};

export const Message = memo(MessageBlock);
