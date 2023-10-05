import styled from 'styled-components';
import { memo } from 'react';
import { MessageContentType } from '../../types';
import { SharedSuccesOrFailIcon } from '../../../local_shared/CheckAndCrossIcon';
import OPSTATE from '../../enums/OperationalState';

export const MessageContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  lineHeight: '0.9em',
  height: '100%',
  width: '100%',
  zIndex: '100',
  paddingBottom: '20%',
});

export const Subline = styled('div')({
  fontSize: '0.9em',
  fontWeight: '500',
  textAlign: 'center',
  whiteSpace: 'pre-line',
  margin: '7px 0',
});

export const Mainline = styled('div')(({ theme }) => ({
  fontWeight: '600',
  fontSize: '1.3em',
  lineHeight: '1.3em',
  color: theme.colors.text.secondary,
  textAlign: 'center',
}));

export const WelcomeLine = styled(Mainline)({
  fontWeight: '500',
  fontSize: '1.5em',
});

export const IconContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '60px',
  marginBottom: '25px',
});

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
