import { memo, useCallback, useContext, useMemo, useRef, useState } from 'react';
// axios
import axios from 'axios';
// styled components
import styled from 'styled-components';
// contexts
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';
import TokenContext from '../../contexts/data/tokenContext';
// enums
import CommandTypes from '../../enums/CommandTypes';
import KeyProcessStatuses from '../../enums/KeyProcessStatuses';
// svgs
import { ReactComponent as CheckmarkIcon } from '../../../images/checkmark.svg';
import { ReactComponent as PresentKeyIcon } from '../../../images/present_key.svg';

const StyledWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.secondary,
  height: '100%',
  position: 'relative',
  width: '100%'
}));
const StyledHeader = styled('div')({
  alignContent: 'center',
  display: 'grid',
  gridTemplateRows: '1fr 1fr',
  justifyContent: 'center'
});
const StyledStatus = styled('div')({
  alignContent: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  width: '100%'
});
const StyledIcon = styled('div')({
  alignContent: 'center',
  display: 'flex',
  height: '100%',
  justifyContent: 'center',
  width: '100%',
  '& > svg': {
  }
});
const StyledContent = styled('div')({
  alignContent: 'center',
  height: '100%',
  justifyContent: 'center',
  width: '100%'
});
const StyledCard = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.primary,
  borderRadius: '5px',
  display: 'grid',
  gridTemplateRows: '1fr 1fr',
  height: 'fit-content',
  padding: '20px',
  width: '80%'
}));
const StyledKeyId = styled('div')({
  fontSize: '16px',
  fontWeight: '600',
  justifyContent: 'center',
  width: '100%'
});
const StyledKeyData = styled('div')({
  justifyContent: 'center',
  width: '100%'
});

const KeyContent = ({ session, type }) => { // type = CREATE_KEY / READ_KEY from CommandTypes
  const appDispatch = useContext(AppDispatchContext);
  const tokens = useContext(TokenContext);
  const [processError, setProcessError] = useState('');
  const [processFinished, setProcessFinished] = useState(false);
  const [processStarted, setProcessStarted] = useState(false);
  const confirmCreateKeyRef = useRef(false);
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

          if (!response?.data) {
            throw Error('No response data');
          }

          console.log('CREATE_KEY was confirmed to backend, sending ID of key used');

          setTimeout(() => { // return to app WAITING status after 5 seconds
            appDispatch({ type: 'set-session', payload: null });
          }, 5000);
        } catch (error) {
          console.error('ERROR: confirm CREATE_KEY to backend: ', error);
          setProcessError('Failed to confirm creation of key');
        }
      };

      sendToBackend();
    }
  }, [session, tokens]);

  const sendReadKey = useCallback(() => {
    if (!pushReadKeyRef.current) {
      pushReadKeyRef.current = true;

      const config = {
        url: `${import.meta.env.VITE_BACKEND_BASE_URL}/active-session`,
        headers: {
          authorization: `Bearer ${tokens.accessToken}`
        },
        method: 'put',
        data: {
          keyId: '123456789',
          data: {
            additionalAccess: ['ENTREE', 'PARKING', 'GYM'],
            roomAccess: ['123'],
            startDateTime: '2023-12-31T15:00Z',
            endDateTime: '2023-08-16T11:00:00'
          }
        },
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
  }, [tokens]);

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
  }, [processStarted, processFinished, type, confirmCreateKey, startProcessing]);

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
  }, [keyProcessStatus, type]);

  return (
    <StyledWrapper>
      <StyledHeader>
        <StyledStatus>{keyProcessTitle}</StyledStatus>
        <StyledIcon>
          {keyProcessStatus === KeyProcessStatuses.READY &&
            <CheckmarkIcon />}
        </StyledIcon>
      </StyledHeader>
      <StyledContent>
        {(keyProcessStatus === KeyProcessStatuses.PRESENT) &&
          <StyledIcon onClick={() => { setProcessStarted(true); }}>
            <PresentKeyIcon />
          </StyledIcon>}
        {(keyProcessStatus === KeyProcessStatuses.PROCESSING || keyProcessStatus === KeyProcessStatuses.READY) &&
          <StyledCard>
            <StyledKeyId />
            <StyledKeyData />
          </StyledCard>}
      </StyledContent>
    </StyledWrapper>
  );
};

export default memo(KeyContent);
