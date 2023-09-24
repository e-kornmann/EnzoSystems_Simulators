import { memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
// styled components
import styled, { keyframes } from 'styled-components';
// api
import { scannerCredentials, reqBody } from '../../config';
import idScanApi from '../../../../../../api/idScannerApi';
// utils
import { changeDeviceStatus, getSession, putScannedData, stopSession } from '../../utils/iDscanApiRequests';
import { calculateCheckDigit } from '../../utils/mrcUtils';
// components
import AnimatedCrossHair from './AnimatedCrossHair';
import SharedLoading from '../../../local_shared/Loading';
import { InputFields } from '../LocalAddId/LocalAddId';
import { SharedSuccesOrFailIcon } from '../../../local_shared/CheckAndCrossIcon';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
// svg images
import { ReactComponent as QrCodeIconNoCanvas } from '../../../local_assets/id_nocanvas.svg';
// enums
import { OperationalStatuses } from '../../enums/OperationalStatuses';
import DeviceStatuses from '../../enums/DeviceStatuses';
import ActionType from '../../enums/ActionTypes';
import { Lang } from '../../App';
import ShowIcon from '../../../local_types/ShowIcon';
// types
import { IdType } from '../../types/IdType';
import { Translate } from '../../Translations/Translations';

const QrScannerWrapper = styled('div')({
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplateRows: '16% 16% 1fr 22%',
  rowGap: '2%',
  padding: '8px 0',
});

const InstructionBox = styled('div')({
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

const IconBox = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: '100%',
});

const ScannerBox = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
});
const ButtonBox = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflowY: 'hidden',
});

const ScanActionButton = styled('button')(({ theme }) => ({
  backgroundColor: 'orange',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '85%',
  height: '50%',
  borderRadius: '4px',
  cursor: 'pointer',
  zIndex: '300',
  '&:active': {
    backgroundColor: theme.colors.buttons.special,
  },
  '& > span': {
    fontWeight: '300',
    fontSize: '0.9em',
    color: 'white',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '70%',
  },
  '& > svg': {
    position: 'relative',
    top: '-1px',
    fill: 'white',
    marginRight: '8px',
  },
  '&:disabled': {
    backgroundColor: theme.colors.buttons.gray,
    cursor: 'inherit',
  },
}));

const slideAnimation = keyframes`
    0% {
      opacity: 0.5;
      transform: translateX(-200vw);
    }
    10%, 80% {
      opacity: 1;
      transform: translateX(0px);
    }
    40%, 60% {
      animation-timing-function: ease-out;
      transform: scale(1);
      transform-origin: center center;
    }
    45%, 55% {
      animation-timing-function: ease-in-out;
      transform: scale(0.91);
    }
    50% {
      animation-timing-function: ease-in-out;
      transform: scale(0.98);
    }
    100% {
      opacity: 0;
      transform: translateX(200vw);
    }
  `;
const AnimatedId = styled.div<{ $animate: boolean }>`
  position: absolute;
  display: ${props => (props.$animate ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  top: 25%;
  width: 100%;
  height: 45%;
  overflow: hidden;
  z-index: 300;
  & > div {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-direction: column;
    gap: 25px;
    width: 93%;
    height: 65%;
    padding: 10% 2%;
    line-height: 0.87em;
    background-color: white;
    animation: ${slideAnimation} 6s ease 0s 1 normal forwards;
    border-radius: 7px;
  `;

const StyledIdHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.3em',
  fontWeight: '500',
  height: '80%',
  color: theme.colors.text.tertiary,
  '& > svg': {
    fill: theme.colors.text.tertiary,
    marginRight: '13px',
    width: '35px',
    height: '20px',
    marginTop: '-3px',
  },
}));

const StyledMrcArea = styled('span')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid black',
  height: '60px',
  width: '100%',
  textAlign: 'center',
  fontFamily: 'monospace',
  whiteSpace: 'pre-line',
  fontVariantNumeric: 'tabular-nums',
  fontWeight: 'bold',
  fontSize: '0.6em',
});

  type Props = {
    deviceStatus: DeviceStatuses;
    currentId: IdType | undefined;
    clickedSetting: boolean;
    appLanguage: Lang;
  };

const IdReaderComponent = ({ deviceStatus, currentId, clickedSetting, appLanguage }: Props) => {
  const appDispatch = useContext(AppDispatchContext);
  const [token, setToken] = useState('');
  const [nextPoll, setNextPoll] = useState(false);
  const initialSessionRequest = useRef(true);
  const [operationalState, setOperationalState] = useState<OperationalStatuses>(OperationalStatuses.DEVICE_START_UP);
  const [instructionText, setInstructionText] = useState('');

  // This useEffect 'listens' to clicked device settings.
  useEffect(() => {
    if (clickedSetting) {
      switch (deviceStatus) {
        case DeviceStatuses.DISCONNECTED:
          setOperationalState(OperationalStatuses.DEVICE_DISCONNECT);
          appDispatch({ type: ActionType.CLICKED_CROSS });
          break;
        case DeviceStatuses.OUT_OF_ORDER:
          setOperationalState(OperationalStatuses.DEVICE_OUT_OF_ORDER);
          appDispatch({ type: ActionType.CLICKED_CROSS });
          break;
        case DeviceStatuses.CONNECTED:
          setOperationalState(OperationalStatuses.DEVICE_START_UP);
          appDispatch({ type: ActionType.CLICKED_CROSS });
          break;
        default:
          break;
      }
    }
  }, [deviceStatus, clickedSetting, appDispatch]);

  const getToken = useCallback(async () => {
    try {
      const authCredentials = btoa(`${scannerCredentials.userName}:${scannerCredentials.passWord}`);
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Basic ${authCredentials}`,
        },
      };
      const response = await idScanApi.post('/auth', reqBody, config);
      if (!response?.data) {
        throw Error('Missing response data');
      } else {
        const { accessToken } = response.data;
        setToken(accessToken);
        console.log(`Id-scanner has been able to get a Token: ${accessToken}`);
        setTimeout(() => {
          setOperationalState(OperationalStatuses.DEVICE_CONNECT);
        }, 500);
      }
    } catch (error) {
      setOperationalState(OperationalStatuses.API_ERROR);
      console.error(`Error: Id-scanner: "${scannerCredentials.userName}" is unable to get authentication token:`, error);
    }
  }, []);

  const getScanSession = useCallback(async () => {
    const res = await getSession(token);
    if (!res) {
      setOperationalState(OperationalStatuses.API_ERROR);
      setNextPoll(false);
      initialSessionRequest.current = true;
    } else {
      // only do next poll if in CONNECTED MODE or WAITING_FOR_ID otherwhise you will get conflicts.
      if ((operationalState === OperationalStatuses.DEVICE_CONNECTED)
      || operationalState === OperationalStatuses.DEVICE_WAITING_FOR_ID) {
        console.log(res);
        setNextPoll(true);
      }
      if (res.status === 'TIMED_OUT') {
        setNextPoll(false);
        initialSessionRequest.current = true;
        setOperationalState(OperationalStatuses.DEVICE_TIMED_OUT);
      }
      if (res.status === 'CANCELLING') {
        setNextPoll(false);
        initialSessionRequest.current = true;
        setOperationalState(OperationalStatuses.API_CANCEL);
      }
      if (res.command === 'SCAN_ID' && res.status === 'ACTIVE' && operationalState === OperationalStatuses.DEVICE_CONNECTED) {
        setOperationalState(OperationalStatuses.DEVICE_WAITING_FOR_ID);
      }
    }
  }, [operationalState, token]);

  const changeStatus = useCallback(async (changeToThisState: DeviceStatuses) => {
    if (token) {
      if (OperationalStatuses.DEVICE_CONNECT) {
        const res = await changeDeviceStatus(token, changeToThisState);
        if (res) {
          if (res.status === DeviceStatuses.CONNECTED) {
            setOperationalState(OperationalStatuses.DEVICE_CONNECTED);
          }
          if (res.status === DeviceStatuses.DISCONNECTED) {
            setOperationalState(OperationalStatuses.DEVICE_DISCONNECTED);
          }
        // if there is no res.data.metadata
        } else if (changeToThisState === DeviceStatuses.CONNECTED) {
          setOperationalState(OperationalStatuses.DEVICE_COULD_NOT_CONNECT);
        } else if (changeToThisState === DeviceStatuses.DISCONNECTED) {
          setOperationalState(OperationalStatuses.DEVICE_COULD_NOT_DISCONNECT);
        }
      }
    }
  }, [token]);

  useEffect(() => {
    let waitTime: number | undefined;
    let intervalId: NodeJS.Timer | null = null;

    switch (operationalState) {
      case OperationalStatuses.DEVICE_START_UP:
        setInstructionText('');
        waitTime = 800;
        break;
      case OperationalStatuses.API_ERROR:
        setInstructionText('SERVER ERROR');
        waitTime = 15000;
        break;
      case OperationalStatuses.DEVICE_CONNECT:
        setInstructionText('');
        changeStatus(DeviceStatuses.CONNECTED);
        // if setting isn't already connected, then set it.
        if (deviceStatus !== DeviceStatuses.CONNECTED) {
          appDispatch({ type: ActionType.SET_DEVICE_STATUS, payload: DeviceStatuses.CONNECTED });
        }
        break;
      case OperationalStatuses.DEVICE_DISCONNECT:
        setInstructionText('Disconnecting...');
        waitTime = 1000;
        break;
      case OperationalStatuses.DEVICE_DISCONNECTED:
        setInstructionText('DISCONNECTED');
        if (deviceStatus !== DeviceStatuses.DISCONNECTED) {
          appDispatch({ type: ActionType.SET_DEVICE_STATUS, payload: DeviceStatuses.DISCONNECTED });
        }
        break;
      case OperationalStatuses.DEVICE_OUT_OF_ORDER:
        setInstructionText('OUT OF ORDER');
        if (deviceStatus !== DeviceStatuses.OUT_OF_ORDER) {
          appDispatch({ type: ActionType.SET_DEVICE_STATUS, payload: DeviceStatuses.OUT_OF_ORDER });
        }
        waitTime = 10000;
        break;
      case OperationalStatuses.DEVICE_CONNECTED:
        setInstructionText('');
        waitTime = 50000;
        // when in this state getSession is initiated
        break;
      case OperationalStatuses.DEVICE_COULD_NOT_CONNECT:
        setInstructionText('Could not connect');
        waitTime = 3500;
        break;
      case OperationalStatuses.DEVICE_COULD_NOT_DISCONNECT:
        setInstructionText('Could not disconnect');
        waitTime = 3500;
        break;
      case OperationalStatuses.DEVICE_WAITING_FOR_ID:
        setInstructionText('Ready to scan ID');
        waitTime = 50000;
        break;
      case OperationalStatuses.API_CANCEL:
        setInstructionText('Scanning cancelled');
        waitTime = 2500;
        break;
      case OperationalStatuses.DEVICE_TIMED_OUT:
        setInstructionText('TIMED OUT');
        waitTime = 2500;
        break;
      case OperationalStatuses.DEVICE_IS_SCANNING:
        setInstructionText('Scanning...');
        waitTime = 3500;
        break;
      case OperationalStatuses.API_SCAN_FAILED:
        setInstructionText('Scan failed');
        waitTime = 2500;
        break;
      case OperationalStatuses.API_SCAN_SUCCESS:
        setInstructionText('SUCCESS');
        waitTime = 2500;
        break;
      default:
        break;
    }

    if (intervalId) {
      clearInterval(intervalId);
    }
    // when in the designated state, execute ↓ this ↓ AFTER the spicified waittime
    if (waitTime) {
      intervalId = setInterval(async () => {
        switch (operationalState) {
          case OperationalStatuses.DEVICE_START_UP:
            if (!token) getToken();
            else setOperationalState(OperationalStatuses.DEVICE_CONNECT);
            break;
          case OperationalStatuses.API_ERROR:
            setOperationalState(OperationalStatuses.DEVICE_START_UP);
            break;
          case OperationalStatuses.DEVICE_CONNECTED:
            setOperationalState(OperationalStatuses.DEVICE_CONNECT);
            break;
          case OperationalStatuses.DEVICE_WAITING_FOR_ID:
            // Set Device in TIME_OUT mode before the API does..
            setOperationalState(OperationalStatuses.API_CANCEL);
            break;
          case OperationalStatuses.DEVICE_DISCONNECT:
            changeStatus(DeviceStatuses.DISCONNECTED);
            break;
          case OperationalStatuses.DEVICE_COULD_NOT_CONNECT:
          case OperationalStatuses.DEVICE_COULD_NOT_DISCONNECT:
            setOperationalState(OperationalStatuses.API_ERROR);
            break;
          case OperationalStatuses.DEVICE_IS_SCANNING:
            if (token && currentId) {
              const res = await putScannedData(token, currentId);
              console.log(res);
              if (res) {
                if (res.status === 'FINISHED') {
                  setOperationalState(OperationalStatuses.API_SCAN_SUCCESS);
                } else {
                  console.log(res);
                  setOperationalState(OperationalStatuses.API_SCAN_FAILED);
                }
              }
            }
            break;
          case OperationalStatuses.API_CANCEL:
            if (token) {
              const res = await stopSession(token);
              if (res.status === 'STOPPED') {
                // stop session is succesfull, now try again to connect;
                setOperationalState(OperationalStatuses.DEVICE_CONNECT);
              } else {
                console.log(res);
                setOperationalState(OperationalStatuses.API_ERROR);
              }
            }
            break;
          case OperationalStatuses.DEVICE_TIMED_OUT:
          case OperationalStatuses.API_SCAN_SUCCESS:
          case OperationalStatuses.API_SCAN_FAILED:
            // now try again to connect:
            setOperationalState(OperationalStatuses.DEVICE_CONNECT);
            break;
            // initial state:
          case OperationalStatuses.DEVICE_OUT_OF_ORDER:
            if (token) {
              // try to change device status on the backend, but stay in this state regardless
              changeStatus(DeviceStatuses.OUT_OF_ORDER);
            } else {
              // if there is no token try again to get one. (in case of a restart)
              setOperationalState(OperationalStatuses.DEVICE_START_UP);
            }
            break;
          default:
            break;
        }
      }, waitTime);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [appDispatch, changeStatus, currentId, deviceStatus, getToken, operationalState, token]);

  const scanQrButtonHandler = async () => {
    setOperationalState(OperationalStatuses.DEVICE_IS_SCANNING);
  };

  /* Repeatedly Get Session Based on operationalState */
  useEffect(() => {
    if (token) {
      // while WAITING, send a new "long" poll for a new session (1st request)
      if ((operationalState === OperationalStatuses.DEVICE_CONNECTED
        || operationalState === OperationalStatuses.DEVICE_WAITING_FOR_ID)
        && initialSessionRequest.current) {
        initialSessionRequest.current = false;
        console.log('initiate getScanSession');
        if (operationalState === OperationalStatuses.DEVICE_WAITING_FOR_ID) {
          // mimmick long poll because somehow it doesn't work when status = ACTIVE
          setTimeout(async () => {
            await getScanSession();
          }, 2500);
        } else {
          getScanSession();
        }
        // any subsequent request
      } else if ((operationalState === OperationalStatuses.DEVICE_CONNECTED
        || operationalState === OperationalStatuses.DEVICE_WAITING_FOR_ID)
        && nextPoll && !initialSessionRequest.current) {
        console.log('next getScanSession');
        setNextPoll(false);
        if (operationalState === OperationalStatuses.DEVICE_WAITING_FOR_ID) {
          setTimeout(async () => {
            await getScanSession();
          }, 2500);
        } else {
          getScanSession();
        }
      }
    }
  }, [getScanSession, nextPoll, operationalState, token]);

  const passPortMrcCode = useMemo(() => {
    let firstLine = '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<';
    let secondLine = '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<';
    let documentNr = '<<<<<<<<<';
    const slicedDateOfBirthYear = currentId?.dateOfBirth?.slice(2);
    const slicedDateOfExpiryYear = currentId?.dateOfExpiry?.slice(2);
    const documentNrData = `${currentId?.documentNumber}`;
    documentNr = documentNrData + documentNr.slice(documentNrData.length);
    const checkDigit = calculateCheckDigit(documentNr);
    const lastCheckDigit = 'XX';

    // eslint-disable-next-line operator-linebreak
    let firstLineData =
    `${currentId?.documentType}<${currentId?.issuerCode}${currentId?.namePrimary}<<${currentId?.nameSecondary}`;

    // eslint-disable-next-line operator-linebreak
    let secondLineData =
     `${documentNr}${checkDigit}${currentId?.nationality}${slicedDateOfBirthYear}${currentId?.sex}${slicedDateOfExpiryYear}PERSNUMBER`;

    // Replace any character not in the range A-Z or 0-9 with a <
    firstLineData = firstLineData.replace(/[^A-Z0-9]/g, '<');

    // Ensure firstLineData does not exceed initial length
    if (firstLineData.length > firstLine.length) {
      firstLineData = firstLineData.slice(0, firstLine.length);
    }

    // Ensure firstLineData does not exceed initial length
    if (secondLineData.length > secondLine.length) {
      secondLineData = secondLineData.slice(0, secondLine.length);
    }

    firstLine = firstLineData + firstLine.slice(firstLineData.length);
    secondLine = secondLineData + secondLine.slice(secondLineData.length);

    secondLine = secondLine.slice(0, -lastCheckDigit.length) + lastCheckDigit;

    return `${firstLine}\n${secondLine}`;
  }, [currentId]);

  return (
      <QrScannerWrapper>
        <InstructionBox>
          {/* {Show loading dots by start-up} */}
          {(
            operationalState === OperationalStatuses.DEVICE_START_UP
          || operationalState === OperationalStatuses.DEVICE_CONNECT
          || operationalState === OperationalStatuses.DEVICE_CONNECTED
          )
          && <SharedLoading $isConnected={ operationalState === OperationalStatuses.DEVICE_CONNECTED } />}
          <span> {instructionText}</span>
        </InstructionBox>
        <IconBox>
          { operationalState === OperationalStatuses.API_SCAN_SUCCESS
          && <SharedSuccesOrFailIcon checkOrCrossIcon={ShowIcon.CHECK} width={30} height={30} /> }
          { operationalState === OperationalStatuses.API_SCAN_FAILED
          && <SharedSuccesOrFailIcon checkOrCrossIcon={ShowIcon.CROSS} width={30} height={30} /> }
        </IconBox>
        <ScannerBox>

            <AnimatedId $animate={
              operationalState === OperationalStatuses.DEVICE_IS_SCANNING
              || operationalState === OperationalStatuses.API_SCAN_SUCCESS
              || operationalState === OperationalStatuses.API_SCAN_FAILED
              }>

              <div>
                <StyledIdHeader>
                  <QrCodeIconNoCanvas />
                  <Translate id={currentId?.documentType} language={appLanguage} />
                </StyledIdHeader>
                <StyledMrcArea>
                  {passPortMrcCode}
                </StyledMrcArea>
              </div>
            </AnimatedId>

          <AnimatedCrossHair
            animate={
              operationalState === OperationalStatuses.DEVICE_WAITING_FOR_ID
              || operationalState === OperationalStatuses.DEVICE_IS_SCANNING}
          />
        </ScannerBox>
        <ButtonBox>
          <ScanActionButton
            type="button"
            onClick={scanQrButtonHandler}
            disabled={!currentId || !currentId[InputFields.DOCUMENT_NR]
              || !currentId[InputFields.NAME_PRIMARY]
              || operationalState !== OperationalStatuses.DEVICE_WAITING_FOR_ID
            }
          >
            <QrCodeIconNoCanvas width={15} height={15} />
            <span>
              {((!currentId || !currentId[InputFields.DOCUMENT_NR])
                ? 'No Ids'
                : `Scan: ${currentId[InputFields.DOCUMENT_NR]}`)}
            </span>
          </ScanActionButton>
        </ButtonBox>
      </QrScannerWrapper>
  );
};

export const IdReader = memo(IdReaderComponent);
