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
import { ReactComponent as CheckmarkIcon } from '../../../images/checkmark.svg';
import { ReactComponent as PresentKeyIcon } from '../../../images/present_key.svg';
// types
import KeyType from '../../types/KeyType';
import ActionType from '../../enums/ActionTypes';

type StyledCardProps = {
  $show: boolean;
};

const StyledWrapper = styled('div')({
  height: '100%',
  display: 'grid',
  gridTemplateRows: '18% 16% 1fr',
  rowGap: '2%',
  overflowY: 'hidden',
  overflowX: 'hidden',
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
  overflowY: 'hidden',
  overflowX: 'hidden',
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
const StyledCardBox = styled('div')<StyledCardProps>(({ $show }) => ({
  position: 'fixed',
  alignItems: 'center',
  display: $show ? 'flex' : 'none',
  justifyContent: 'center',
  top: '20%',
  width: '100%',
  height: '60%',
  zIndex: 300,
  overflowY: 'hidden',
  overflowX: 'hidden',
}));

const StyledCard = styled('div')<{ $animateText: boolean }>`
  display: grid;
  grid-template-rows: 30% 25% 20% 25%;
  animation: ${slideAnimation} 6s ease 0s 1 normal forwards;
  background-color: ${props => props.theme.colors.background.primary};
  border-radius: 12px;
  min-height: 100px;
  max-height: 400px;
  max-width: 600px;
  height: 46%;
  width: 88%;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
  color: ${props => props.theme.colors.text.primary};
  & > div {
    opacity: ${props => (props.$animateText ? 0 : 1)};
  }
`;

const StyledRoomNumber = styled('div')`
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;  
  animation: ${textFadeInAnimation} 0.2s ease 0.75s 1 normal forwards;
  font-size: 1.5em;
  font-weight: 600;
`;

const StyledAdditionalAccess = styled(StyledRoomNumber)`
  align-items: center;
  animation: ${textFadeInAnimation} 0.2s ease 1.25s 1 normal forwards;
  font-size: 0.75em;
  font-weight: 500;
  text-align: center;
`;
const StyledStartDate = styled('div')`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;  
  animation: ${textFadeInAnimation} 0.2s ease 1.50s 1 normal forwards;
  font-size: 0.95em;
  font-weight: 500;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;
const StyledEndDate = styled(StyledStartDate)`
  align-items: flex-start;
  animation: ${textFadeInAnimation} 0.2s ease 1.75s 1 normal forwards;
`;

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
        url: `${import.meta.env.VITE_KEY_ENCODER_LOCAL_BASE_URL}/active-session`,
        headers: {
          authorization: `Bearer ${tokens.accessToken}`,
        },
        method: 'put',
        data: {
          data: {
            keyId: '43764387634',
            status: 'FINISHED',
          },
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

      const data = { ...selectedKey, status: 'FINISHED' };
      const newData = { data };

      const config = {
        url: `${import.meta.env.VITE_KEY_ENCODER_LOCAL_BASE_URL}/active-session`,
        headers: {
          authorization: `Bearer ${tokens.accessToken}`,
        },
        method: 'put',
        data: newData,
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
        <StyledCardBox $show={keyProcessStatus === KeyProcessStatuses.PROCESSING || keyProcessStatus === KeyProcessStatuses.READY}>

          <StyledCard $animateText={!(type === CommandTypes.READ_KEY)}>

            <StyledRoomNumber>
              {type === CommandTypes.READ_KEY
                ? selectedKey?.roomAccess.join(', ')
                : createdKeyData?.roomAccess.join(', ')}
            </StyledRoomNumber>

            <StyledAdditionalAccess>
              {type === CommandTypes.READ_KEY
                ? `Access to: \n ${selectedKey?.additionalAccess.join(', ')}`
                : `Access to: \n ${createdKeyData?.additionalAccess.join(', ')}`}
            </StyledAdditionalAccess>

            <StyledStartDate >
              {type === CommandTypes.READ_KEY
                ? `${(selectedKey && isoParser(selectedKey.startDateTime))}`
                : `${(createdKeyData && isoParser(createdKeyData.startDateTime))}`
              }
            </StyledStartDate>
            <StyledEndDate>
              {type === CommandTypes.READ_KEY
                ? `${(selectedKey && isoParser(selectedKey.endDateTime))}`
                : `${(createdKeyData && isoParser(createdKeyData.endDateTime))}`
              }
            </StyledEndDate>

          </StyledCard>

        </StyledCardBox>

      </StyledContent>
    </StyledWrapper>
  );
};

export const KeyContent = memo(KeyContentComponent);
