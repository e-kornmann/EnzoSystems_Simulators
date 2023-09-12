import { memo, useCallback, useContext, useMemo, useRef, useState } from 'react';
// axios
import axios from 'axios';
// date-fns
import { format, parseISO } from 'date-fns';
// styled components
import styled, { keyframes } from 'styled-components';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
import TokenContext from '../../contexts/data/TokenContext';
// enums
import CommandTypes from '../../enums/CommandTypes';
import KeyProcessStatuses from '../../enums/KeyProcessStatuses';
// svgs
import { ReactComponent as CheckmarkIcon } from '../../../../../assets/svgs/checkmark.svg';
import { ReactComponent as PresentKeyIcon } from '../../../../../assets/svgs/present_key.svg';
// types
import { KeyType } from '../../types/KeyType';
import ActionType from '../../enums/ActionTypes';

type StyledCardProps = {
  $show: boolean;
};
type StyledItemProps = {
  $animateText: boolean
};

const StyledWrapper = styled('div')({
  height: '100%',
  display: 'grid',
  gridTemplateRows: '18% 16% 1fr',
  rowGap: '2%',
  overflowY: 'hidden',
});
const StyledHeader = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-end',
  '& > span': {
    whiteSpace: 'pre-line',
    textAlign: 'center',
    fontSize: '1.15em',
    lineHeight: '1.23em',
    fontWeight: '500',
  },
});
const StyledIcon = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  '& > svg': {
    height: '20px',
    fill: theme.colors.buttons.green,
  },
}));

const StyledPresentKeyButton = styled('button')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: '100%',
  cursor: 'pointer',
  '& > svg': {
    fill: theme.colors.text.primary,
  },
  '&:disabled': {
    cursor: 'cursor',
    '& > svg': {
      fill: theme.colors.buttons.lightgray,
    },
  },
}));

const StyledContent = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
});

const slideAnimation = keyframes`
  0% {
    opacity: 0.5;
    transform: translateX(-200vw);
  }
  5%, 90% {
    opacity: 1;
    transform: translateX(0px);
  }
  100% {
    opacity: 1;
    transform: translateX(200vw);
  }
`;
const textFadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const StyledCard = styled('div')<StyledCardProps>(({ $show }) => ({
  alignItems: 'center',
  display: $show ? 'flex' : 'none',
  justifyContent: 'center',
  height: '60%',
  top: '20%',
  width: '100%',
  zIndex: 300,
}));
const StyledCardContent = styled('div')`
  alignItems: center;
  animation: ${slideAnimation} 6s ease 0s 1 normal forwards;
  backgroundColor: ${props => props.theme.colors.background.primary};
  borderRadius: 12px;
  boxShadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
  display: grid;
  gridTemplateRows: 30% 30% 20% 20%;
  height: 46%;
  maxHeight: 400px;
  minHeight: 100px;
  maxWidth: 600px;
  padding: 5%;
  width: 88%;
`;
const StyledItem = styled('div')<StyledItemProps>(({ theme, $animateText }) => ({
  color: theme.colors.text.primary,
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 500,
  lineHeight: '1.3em',
  opacity: $animateText ? 0 : 1,
  textAlign: 'center',
}));
const StyledRoomNumber = styled(StyledItem)`
  animation: ${textFadeInAnimation} 0.2s ease 0.75s 1 normal forwards;
  fontSize: 1.5em;
  fontVariantNumeric: normal;
  fontWeight: 600;
`;
const StyledAdditionalAccess = styled(StyledItem)`
  animation: ${textFadeInAnimation} 0.2s ease 1.25s 1 normal forwards;
  fontSize: 0.75em;
  fontVariantNumeric: normal;
`;
const StyledDates = styled(StyledItem)`
  animation: ${textFadeInAnimation} 0.2 ease 1.5s 1 normal forwards;
  fontSize: 0.95em;
`;
const StyledDate = styled('div')({
  fontVariantNumeric: 'tabular-nums',
});

type KeyContentProps = {
  selectedKey: KeyType | null,
  type?: CommandTypes
};

const KeyContentComponent = ({ selectedKey, type }: KeyContentProps) => {
  const appDispatch = useContext(AppDispatchContext);
  const tokens = useContext(TokenContext);
  const [createdKeyData, setCreatedKeyData] = useState<KeyType | null>(null);
  const [processError, setProcessError] = useState('');
  const [processFinished, setProcessFinished] = useState(false);
  const [processStarted, setProcessStarted] = useState(false);
  const confirmCreateKeyRef = useRef(false);
  const pushReadKeyRef = useRef(false);
  const startRef = useRef(false);

  const isoParser = useCallback((isostring: string): string | null => format(parseISO(isostring), 'yyyy-MM-dd | HH:mm'), []);

  const startProcessing = useCallback(() => {
    if (!startRef.current) {
      startRef.current = true;
      setTimeout(() => {
        setProcessFinished(true);
      }, 1000);
    }
  }, []);

  const confirmCreatekey = useCallback(() => {
    if (!confirmCreateKeyRef.current && tokens?.accessToken) {
      confirmCreateKeyRef.current = true;

      const config = {
        url: `${import.meta.env.VITE_BACKEND_BASE_URL}/active-session`,
        headers: {
          authorization: `Bearer ${tokens.accessToken}`,
        },
        method: 'put',
        data: {
          keyId: '43764387634',
        },
      };

      const sendToBackend = async () => {
        try {
          const response = await axios(config);

          if (!response?.data) {
            throw Error('No response data');
          } else if (!response.data?.metadata?.keyData) {
            throw Error('No keydata in response');
          } else {
            setCreatedKeyData(response.data.metadata.keyData);
            console.log('CREATE_KEY was confirmed by backned, sending ID of key: ', response.data.metadata.keyData.keyId);
            setTimeout(() => { // return to app WAITING status after 5 seconds
              appDispatch({ type: ActionType.SET_SESSION, payload: null });
            }, 5000);
          }
        } catch (error) {
          console.error('ERROR: confirm CREATE_KEY to backend: ', error);
          setProcessError('Failed to confirm creation of key');
        }
      };

      sendToBackend();
    }
  }, [tokens, appDispatch]);

  const sendReadKey = useCallback(() => {
    if (!pushReadKeyRef.current && tokens?.accessToken) {
      pushReadKeyRef.current = true;

      const config = {
        url: `${import.meta.env.VITE_BACKEND_BASE_URL}/active-session`,
        headers: {
          authorization: `Bearer ${tokens.accessToken}`,
        },
        method: 'put',
        data: selectedKey,
      };

      const sendToBackend = async () => {
        try {
          const response = await axios(config);

          if (!response?.data) {
            throw Error('No response data');
          }

          setTimeout(() => { // return to app WAITING status after 5 seconds
            appDispatch({ type: ActionType.SET_SESSION, payload: null });
          }, 5000);
        } catch (error) {
          console.error('ERROR: send READ_KEY to backend: ', error);
          setProcessError('Failed to send scanned key');
        }
      };

      sendToBackend();
    }
  }, [selectedKey, tokens, appDispatch]);

  const keyProcessStatus = useMemo((): KeyProcessStatuses | undefined => {
    if (type === CommandTypes.CREATE_KEY
      || type === CommandTypes.CREATE_COPY_KEY
      || type === CommandTypes.CREATE_JOINNER_KEY
      || type === CommandTypes.CREATE_NEW_KEY) {
      if (processStarted && !processFinished) {
        startProcessing();
        return KeyProcessStatuses.PROCESSING;
      } if (processStarted && processFinished) {
        startRef.current = false; // reset processing, just in case
        confirmCreatekey();
        return KeyProcessStatuses.READY;
      } if (processError) {
        return KeyProcessStatuses.ERROR;
      }
      return KeyProcessStatuses.PRESENT;
    } if (type === CommandTypes.READ_KEY) {
      if (processStarted && !processFinished) {
        startProcessing();
        return KeyProcessStatuses.PROCESSING;
      } if (processStarted && processFinished) {
        startRef.current = false; // reset processing, just in case
        sendReadKey();
        return KeyProcessStatuses.READY;
      } if (processError) {
        return KeyProcessStatuses.ERROR;
      }
      return KeyProcessStatuses.PRESENT;
    }
    return undefined;
  }, [processError, processFinished, processStarted, type, confirmCreatekey, sendReadKey, startProcessing]);

  const keyProcessTitle = useMemo(() => {
    if (type === CommandTypes.CREATE_KEY
      || type === CommandTypes.CREATE_COPY_KEY
      || type === CommandTypes.CREATE_JOINNER_KEY
      || type === CommandTypes.CREATE_NEW_KEY) {
      switch (keyProcessStatus) {
        case KeyProcessStatuses.ERROR:
          return 'Error';
        case KeyProcessStatuses.PRESENT:
          return 'Present a card';
        case KeyProcessStatuses.PROCESSING:
          return 'Please wait';
        case KeyProcessStatuses.READY:
          return 'Key is read';
        default:
          return 'Error';
      }
    } else if (type === CommandTypes.READ_KEY) {
      switch (keyProcessStatus) {
        case KeyProcessStatuses.ERROR:
          return 'Error';
        case KeyProcessStatuses.PRESENT:
          if (!selectedKey) {
            return 'There is no key available to scan';
          }
          return 'Scan your key';
        case KeyProcessStatuses.PROCESSING:
          return 'Please wait';
        case KeyProcessStatuses.READY:
          return 'Key has been scanned';
        default:
          return 'Error';
      }
    } else { return 'Error'; }
  }, [keyProcessStatus, selectedKey, type]);

  return (
    <StyledWrapper>
      <StyledHeader>
        <span>{keyProcessTitle}</span>
      </StyledHeader>

      <StyledIcon>
        {/* Still have to put in a conditionally failure icon */}
        {keyProcessStatus === KeyProcessStatuses.READY && <CheckmarkIcon />}
      </StyledIcon>

      <StyledContent>
        {keyProcessStatus === KeyProcessStatuses.PRESENT
          && <StyledPresentKeyButton
            type="button"
            disabled={!selectedKey && type === CommandTypes.READ_KEY} onClick={() => { setProcessStarted(true); }}>
            <PresentKeyIcon />
          </StyledPresentKeyButton>
        }
        <StyledCard $show={keyProcessStatus === KeyProcessStatuses.PROCESSING || keyProcessStatus === KeyProcessStatuses.READY}>
          <StyledCardContent>
            <StyledRoomNumber $animateText={
              type === CommandTypes.CREATE_KEY
              || type === CommandTypes.CREATE_COPY_KEY
              || type === CommandTypes.CREATE_JOINNER_KEY
              || type === CommandTypes.CREATE_NEW_KEY
              }>
              {(type !== CommandTypes.CREATE_KEY
                && type !== CommandTypes.CREATE_COPY_KEY
                && type !== CommandTypes.CREATE_JOINNER_KEY
                && type !== CommandTypes.CREATE_NEW_KEY) ? selectedKey?.data?.roomAccess.join(', ') : createdKeyData?.data.roomAccess.join(', ')}
            </StyledRoomNumber>

            <StyledAdditionalAccess $animateText={
              type === CommandTypes.CREATE_KEY
              || type === CommandTypes.CREATE_COPY_KEY
              || type === CommandTypes.CREATE_JOINNER_KEY
              || type === CommandTypes.CREATE_NEW_KEY
              }>
              {(type !== CommandTypes.CREATE_KEY
                && type !== CommandTypes.CREATE_COPY_KEY
                && type !== CommandTypes.CREATE_JOINNER_KEY
                && type !== CommandTypes.CREATE_NEW_KEY)
                ? `Access to: ${selectedKey?.data?.additionalAccess.join(', ')}`
                : `Access to: ${createdKeyData?.data?.additionalAccess.join(', ')}`}
            </StyledAdditionalAccess>

            <StyledDates $animateText={
              type === CommandTypes.CREATE_KEY
              || type === CommandTypes.CREATE_COPY_KEY
              || type === CommandTypes.CREATE_JOINNER_KEY
              || type === CommandTypes.CREATE_NEW_KEY
              }>
              <StyledDate >
                {(type !== CommandTypes.CREATE_KEY
                  && type !== CommandTypes.CREATE_COPY_KEY
                  && type !== CommandTypes.CREATE_JOINNER_KEY
                  && type !== CommandTypes.CREATE_NEW_KEY)
                  ? (selectedKey && isoParser(selectedKey.data.startDateTime))
                  : (createdKeyData && isoParser(createdKeyData.data.startDateTime))}
              </StyledDate>
              <StyledDate>
                {(type !== CommandTypes.CREATE_KEY
                  && type !== CommandTypes.CREATE_COPY_KEY
                  && type !== CommandTypes.CREATE_JOINNER_KEY
                  && type !== CommandTypes.CREATE_NEW_KEY)
                  ? (selectedKey && isoParser(selectedKey.data.endDateTime))
                  : (createdKeyData && isoParser(createdKeyData.data.endDateTime))}
              </StyledDate>
            </StyledDates>
          </StyledCardContent>
        </StyledCard>

      </StyledContent>
    </StyledWrapper>
  );
};

export const KeyContent = memo(KeyContentComponent);
