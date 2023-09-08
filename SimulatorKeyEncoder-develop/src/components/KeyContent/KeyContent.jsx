import { memo, useCallback, useContext, useMemo, useRef, useState } from 'react';
// axios
import axios from 'axios';
// styled components
import styled, { keyframes } from 'styled-components';
// contexts
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';
import TokenContext from '../../contexts/data/tokenContext';
// enums
import CommandTypes from '../../enums/CommandTypes';
import KeyProcessStatuses from '../../enums/KeyProcessStatuses';
// svgs
import { ReactComponent as CheckmarkIcon } from '../../../images/checkmark.svg';
import { ReactComponent as PresentKeyIcon } from '../../../images/present_key.svg';
// date fns
import { parseISO, format } from 'date-fns';

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
    fontWeight: '500'
  }
});

const StyledIcon = styled('div')(({theme}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  '& > svg': {
    height: '20px',
    fill: theme.colors.buttons.green,
  }
  
}));

const StyledPresentKeyButton = styled('button')(({theme, $disabled}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: '100%',
  cursor: $disabled ? 'cursor' : 'pointer', 
  '& > svg': {
    fill: $disabled ? theme.colors.buttons.lightgray : theme.colors.text.primary,
  }

}));

const StyledContent = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start'
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

const StyledCard = styled.div`
  position: fixed;
  display:  ${props => props.$show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  top: 20%;
  width: 100%;
  height: 60%;
  overflow: hidden;
  z-index: 300;
  font-size: 0.9em;
  & > div {
    animation: ${slideAnimation} 6s ease 0s 1 normal forwards;
    background-color: ${props => props.theme.colors.background.primary};
    border-radius: 12px;
    display: grid;
    grid-template-rows: 30% 30% 20% 20%;
    align-items: center;
    height: 46%;
    width: 88%;
    min-height: 100px;
    max-height: 400px;
    max-width: 600px;
    box-shadow: rgba(0, 0, 0, 0.04) 0px 3px 5px;
    & > div {
      text-align: center;
      line-height: 1.3em;
      font-variant-numeric: tabular-nums;
      font-weight: 500;
      color: ${props => props.theme.colors.text.primary};
      opacity: ${props => props.$animateText ? 0 : 1 };
      &:nth-child(1) {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5em;
        font-weight: 600;
        font-variant-numeric: normal;
        animation: ${textFadeInAnimation} 0.2s ease 0.75s 1 normal forwards;
      }
      &:nth-child(2) {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75em;
        font-variant-numeric: normal;
        animation: ${textFadeInAnimation} 0.2s ease 1.25s 1 normal forwards;
        margin-top: 2%,
      }
      &:nth-child(3) {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-variant-numeric: tabular-nums;
        animation: ${textFadeInAnimation} 0.2s ease 1.5s 1 normal forwards;
        font-size: 0.95em;
      }
      &:nth-child(4) {
        height: 100%;
        display: flex;
        justify-content: center;
        font-variant-numeric: tabular-nums;
        animation: ${textFadeInAnimation} 0.2s ease 1.75s 1 normal forwards;
        font-size: 0.95em;
      }
    }
  }
`;

 

const KeyContentAnimation = ({ type, selectedKey }) => { // type = CREATE_KEY / READ_KEY from CommandTypes
  const appDispatch = useContext(AppDispatchContext);
  const tokens = useContext(TokenContext);
  const [processError, setProcessError] = useState('');
  const [processFinished, setProcessFinished] = useState(false);
  const [processStarted, setProcessStarted] = useState(false);
  const confirmCreateKeyRef = useRef(false);
  const [createdKeyData, setCreatedKeyData] = useState({});
  const pushReadKeyRef = useRef(false);
  const startRef = useRef(false);

  const startProcessing = useCallback(() => {
    if (!startRef.current) {
      startRef.current = true;
      setTimeout(() => {
        console.log('processed key');
        setProcessFinished(true);
      }, 1000);
    }
  }, []);

  const confirmCreateKey = useCallback(() => {
    if (!confirmCreateKeyRef.current) {
      confirmCreateKeyRef.current = true;

      const config = {
        url: `${import.meta.env.VITE_BACKEND_BASE_URL}/active-session`,
        headers: {
          authorization: `Bearer ${tokens.accessToken}`
        },
        method: 'put',
        data: {
          keyId: '43764387634'
        },
        timeout: import.meta.env.VITE_TIMEOUT
      };

      const sendToBackend = async () => {
        try {
          const response = await axios(config);

          if (!response?.data && !response?.data?.metadata) {
            throw Error('No response data');
          } else {
            setCreatedKeyData(response.data.metadata.keyData);
            console.log('CREATE_KEY was confirmed by backend, sending ID of key used: ' + response.data.metadata.keyId);
            setTimeout(() => { // return to app WAITING status after 5 seconds
              appDispatch({ type: 'set-session', payload: null });
            }, 5000);
          }
        } catch (error) {
          console.error('ERROR: confirm CREATE_KEY to backend: ', error);
          setProcessError('Failed to confirm creation of key');
        }
      };
      sendToBackend();
    }
  }, [appDispatch, tokens.accessToken]);

  const sendReadKey = useCallback(() => {
     if (!pushReadKeyRef.current) {
      pushReadKeyRef.current = true;

      const config = {
        url: `${import.meta.env.VITE_BACKEND_BASE_URL}/active-session`,
        headers: {
          authorization: `Bearer ${tokens.accessToken}`
        },
        method: 'put',

        data: selectedKey
          // keyId: '123456789',
          // data: {
          //   additionalAccess: selectedKey.data.additionalAccess,
          //   roomAccess: selectedKey.data.roomAccess,
          //   startDateTime: selectedKey.data.startDateTime,
          //   endDateTime: selectedKey.data.endDateTime
          // }
        ,
        timeout: import.meta.env.VITE_TIMEOUT
      };

      const sendToBackend = async () => {
        try {
          const response = await axios(config);

          if (!response?.data) {
            throw Error('No response data');
          }

          console.log('READ_KEY was sent to backend!');

          setTimeout(() => { // return to app WAITING status after 5 seconds
            appDispatch({ type: 'set-session', payload: null });
          }, 5000);
        } catch (error) {
          console.error('ERROR: send READ_KEY to backend: ', error);
          setProcessError('Failed to send scanned key');
        }
      };

      sendToBackend();
    }
  }, [appDispatch, selectedKey, tokens.accessToken]);

  const keyProcessStatus = useMemo(() => {
    if (type === CommandTypes.CREATE_KEY) { // CREATE_KEY command statuses
      if (processStarted && !processFinished) {
        startProcessing();
        return KeyProcessStatuses.PROCESSING;
      } else if (processStarted && processFinished) {
        startRef.current = false; // reset processing, just in case
        confirmCreateKey();
        return KeyProcessStatuses.READY;
      } else if (processError) {
        return KeyProcessStatuses.ERROR;
      } else {
        return KeyProcessStatuses.PRESENT;
      }
    } else if (type === CommandTypes.READ_KEY) { // READ_KEY command statuses
      if (processStarted && !processFinished) {
        startProcessing();
        return KeyProcessStatuses.PROCESSING;
      } else if (processStarted && processFinished) {
        startRef.current = false; // reset processing just in case
        sendReadKey();
        return KeyProcessStatuses.READY;
      } else if (processError) {
        return KeyProcessStatuses.ERROR;
      } else {
        return KeyProcessStatuses.PRESENT;
      }

    } else {
      return KeyProcessStatuses.ERROR;
    }
  }, [type, processStarted, processFinished, processError, startProcessing, confirmCreateKey, sendReadKey]);

  const keyProcessTitle = useMemo(() => {
    if (type === CommandTypes.CREATE_KEY) {
      switch (keyProcessStatus) {
        case KeyProcessStatuses.ERROR:
          return 'Error';
        case KeyProcessStatuses.PRESENT:
          return 'Present a card';
        case KeyProcessStatuses.PROCESSING:
          return 'Please wait';
        case KeyProcessStatuses.READY:
          return 'Key is ready';
        default:
          return 'Error';
      }
    } else if (type === CommandTypes.READ_KEY) {
      switch (keyProcessStatus) {
        case KeyProcessStatuses.ERROR:
          return 'Error';
        case KeyProcessStatuses.PRESENT:
          if (!selectedKey) {
            return `There is no key\n available to scan` 
          }
          return 'Scan your key';
        case KeyProcessStatuses.PROCESSING:
          return 'Please wait';
        case KeyProcessStatuses.READY:
          return 'Key has been scanned';
        default:
          return 'Error';
      }
    } else {
      return 'Error';
    }
  }, [keyProcessStatus, selectedKey, type]);

  return (
    <StyledWrapper>
      <StyledHeader>
        <span>{keyProcessTitle}</span>
      </StyledHeader>
      <StyledIcon>
      {/* Still have to put in a conditionally failure icon */}
       {keyProcessStatus === KeyProcessStatuses.READY && <CheckmarkIcon/>}
      </StyledIcon>

      <StyledContent>
      {(keyProcessStatus === KeyProcessStatuses.PRESENT) && (


        <StyledPresentKeyButton type="button" disabled={!selectedKey && type === CommandTypes.READ_KEY } $disabled={!selectedKey && type === CommandTypes.READ_KEY} onClick={() => { setProcessStarted(true); }}>
          <PresentKeyIcon  />
        </StyledPresentKeyButton>

)}
          <StyledCard $show={keyProcessStatus === KeyProcessStatuses.PROCESSING || keyProcessStatus === KeyProcessStatuses.READY} $animateText={type === CommandTypes.CREATE_KEY}>
          <div>
              <div>{type !== CommandTypes.CREATE_KEY ? selectedKey?.data?.roomAccess.join(', ') : createdKeyData.roomAccess && createdKeyData.roomAccess.join(', ') }</div>
              <div>{type !== CommandTypes.CREATE_KEY ? 'Access to: ' + selectedKey?.data?.additionalAccess.join(', ') : createdKeyData.additionalAccess && 'Access to: ' + createdKeyData.additionalAccess.join(', ')}</div>
              <div>{type !== CommandTypes.CREATE_KEY ? format(parseISO(selectedKey?.data?.startDateTime), 'yyyy-MM-dd | HH:mm') : createdKeyData.startDateTime && format(parseISO(createdKeyData.startDateTime), 'yyyy-MM-dd | HH:mm')}</div>
              <div>{type !== CommandTypes.CREATE_KEY ? format(parseISO(selectedKey?.data?.endDateTime), 'yyyy-MM-dd | HH:mm') : createdKeyData.endDateTime && format(parseISO(createdKeyData.endDateTime), 'yyyy-MM-dd | HH:mm')}</div>
          </div>
          </StyledCard>
  
    </StyledContent>
    </StyledWrapper >
  );
};

const KeyContent = memo(KeyContentAnimation);
export default KeyContent;
