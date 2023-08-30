import styled, { css, keyframes } from 'styled-components';
import SuccessIcon from '../../../shared/Success';
import * as Sv from '../../../../styles/stylevariables';
import { QrAppModi, QrCode } from '..';
import { GenericFooter } from '../../../shared/DraggableModal/ModalTemplate';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ReactComponent as QrCodeIcon } from '../../../../assets/svgs/qr_code.svg';
import { ReactComponent as QrCodeIconNoCanvas } from '../../../../assets/svgs/qrCode_withoutFrame.svg';
import { ReactComponent as AddIcon } from '../../../../assets/svgs/add_qr_code.svg';
import { Loading } from '../../../shared/Loading';
import AnimatedCrossHair from './AnimatedCrossHair';
import useLogOn from '../../../../hooks/useLogOn';
import { reqBody, scannerCredentials } from '../config';
import { changeDeviceStatus } from '../utils/changeDeviceStatus';
import { putScannedData } from '../utils/putScannedData';
import CrossIcon from '../../../shared/Fail';
import { getSession } from '../utils/getSession';
import { ReactComponent as SettingsIcon } from '../../../../assets/svgs/settings.svg';
import { AppContext, SettingModes } from '../utils/settingsReducer';
import ts from '../Translations/translations';
import { statusOptions } from './DeviceSettings/AvailableSettings/StatusOptions';

const QrScannerWrapper = styled('div')({
  display: 'grid',
  gridTemplateRows: '14% 16% 1fr 20% auto',
  rowGap: '2%'
});

const InstructionBox = styled('div')({
  const: '100%',
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

const IconBox = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: '100%'
});

const ScannerBox = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start'
});
const ButtonBox = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflowY: 'hidden'
});

const ScanActionButton = styled('button')(({ theme } ) => ({
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
    backgroundColor: theme.colors.brandColors.enzoOrange,
  },
  '& > span': {
    fontWeight: '300',
    fontSize: '0.9em',
    color: 'white',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '70%'
  },
  '& > svg': {
    position: 'relative',
    top: '-1px',
    fill: 'white',
    marginRight: '8px'
  },
  '&:disabled': {
    backgroundColor: theme.colors.buttons.gray,
    cursor: 'inherit',
  }
}))

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

const AnimatedQr = styled.div<{$animate: boolean}>`
position: absolute;
display: ${ props => props.$animate ? 'flex' : 'none' };
align-items: center;
justify-content: center;
top: 30%;
width: 100%;
height: 40%;
overflow: hidden;
z-index: 300;
& > div {
  width: 60%;
  padding: 7%;
  background-color: white;
  animation: ${slideAnimation} 6s ease 0s 1 normal forwards;
  border-radius: 3px;
   & > svg {
    width: 100%;
    height: 100%;
    fill: ${ props => props.theme.colors.text.black};
   }
  }

`

export enum OperationalState {
  DEVICE_START_UP,
  DEVICE_CONNECT,
  DEVICE_DISCONNECT,
  DEVICE_CONNECTED,
  DEVICE_DISCONNECTED,
  DEVICE_COULD_NOT_CONNECT,
  DEVICE_OUT_OF_ORDER,
  DEVICE_WAITING_FOR_BARCODE,
  DEVICE_STOPPED,
  DEVICE_TIMED_OUT,
  DEVICE_IS_SCANNING,
  API_SCAN_FAILED,
  API_SCAN_SUCCESS,
  API_ERROR,
}

type Props = {
  modusSetterHandler: (modus: QrAppModi) => void;
  currentQrCode: QrCode;
};

const QrCodeReader = ({ modusSetterHandler, currentQrCode }: Props) => {
  const { state, dispatch } = useContext(AppContext);
  const [init, setInit] = useState(false);
  const { token, logOn } = useLogOn(scannerCredentials, reqBody, 'barcode-scanner');
  const [deviceStatus, setDeviceStatus] = useState<OperationalState>(OperationalState.DEVICE_START_UP);
  const [instructionText, setInstructionText] = useState('');


  // This useEffect 'listens' to clicked device settings.
  useEffect(() => {
    // connect when Connected settings has been clicked.
    if (state.statusOption === statusOptions.CONNECTED) {
      // if you are already logged in
      init ? setDeviceStatus(OperationalState.DEVICE_CONNECT) : setDeviceStatus(OperationalState.DEVICE_START_UP)
    }
    // disconnect when Disonnected settings has been clicked.
    if (state.statusOption === statusOptions.DISCONNECTED) setDeviceStatus(OperationalState.DEVICE_DISCONNECT);
    // OUT_OF_ORDER when OUT_OF_ORDER settings has been clicked.
    if (state.statusOption === statusOptions.OUT_OF_ORDER) setDeviceStatus(OperationalState.DEVICE_OUT_OF_ORDER);
  }, [init, state.statusOption])


  const getToken = useCallback(async () => {
    if (!init) {
      await logOn().then((success) => {
        if (success) {
          setTimeout(() => {
            setInit(true);
            setDeviceStatus(OperationalState.DEVICE_CONNECT);
          }, 500);
        } else {
            setDeviceStatus(OperationalState.API_ERROR);
        }
      });
    }
  }, [init, logOn]);

  useEffect(() => {
    let waitTime: number | undefined = undefined;
    let intervalId: NodeJS.Timer | null = null;
    let checkCounter = 0; // Counter for the number of checks

    switch (deviceStatus) {
      case OperationalState.DEVICE_START_UP:
        getToken();
        break;
      case OperationalState.API_ERROR:
        setInstructionText('SERVER ERROR');
        waitTime = 3000;
        break;
      case OperationalState.DEVICE_CONNECT:
        setInstructionText('');
        waitTime = 1000;
        break;
      case OperationalState.DEVICE_DISCONNECT:
        setInstructionText('Disconnecting...');
        waitTime = 1000;
        break;
      case OperationalState.DEVICE_DISCONNECTED:
        setInstructionText(`DISCONNECTED`);
        if (state.statusOption !== statusOptions.DISCONNECTED) {
          dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: statusOptions.DISCONNECTED })
        }
        break;
      case OperationalState.DEVICE_OUT_OF_ORDER:
        setInstructionText(ts('outOfOrder', state.language));
        if (state.statusOption !== statusOptions.OUT_OF_ORDER) {
          dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: statusOptions.OUT_OF_ORDER })
        }
        waitTime = 3000;
        break;
      case OperationalState.DEVICE_CONNECTED:
        setInstructionText('CONNECTED');
        waitTime = 1000;
        break;
      case OperationalState.DEVICE_COULD_NOT_CONNECT:
        setInstructionText(ts('couldNotConnect', state.language));
        waitTime = 3500;
        break;
      case OperationalState.DEVICE_WAITING_FOR_BARCODE:
        setInstructionText(ts('readyToScan', state.language));
        waitTime = 1000;
        checkCounter = 0;
        break;
      case OperationalState.DEVICE_STOPPED:
        setInstructionText('DEVICE DISABLED');
        waitTime = 2500;
        break;
      case OperationalState.DEVICE_TIMED_OUT:
        setInstructionText('TIMED OUT');
        waitTime = 2500;
        break;
      case OperationalState.DEVICE_IS_SCANNING:
        setInstructionText('Scanning...');
        waitTime = 3500;
        break;
      case OperationalState.API_SCAN_FAILED:
        setInstructionText('Scan failed');
        waitTime = 2500;
        break;
      case OperationalState.API_SCAN_SUCCESS:
        setInstructionText('SUCCESS');
        waitTime = 2500;
        break;
    }
    if (intervalId) {
      clearInterval(intervalId);
    }
    // when in the designated state, execute ↓ this ↓ AFTER the spicified waittime
    if (waitTime) {
      let response = undefined;

      intervalId = setInterval(async () => {
        switch (deviceStatus) {
          case OperationalState.API_ERROR:
            setDeviceStatus(OperationalState.DEVICE_START_UP)
            break;   
          case OperationalState.DEVICE_CONNECT:
            if (token) {
              response = await changeDeviceStatus(token, 'CONNECTED');
              if (response) {
                if (response.status !== 200) {
                  setDeviceStatus(OperationalState.DEVICE_COULD_NOT_CONNECT);
                } else if (response.status === 200) {
                  setDeviceStatus(OperationalState.DEVICE_CONNECTED);
                  // update Settings because initial state is OUT_OF_ORDER
                  dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: statusOptions.CONNECTED })
                }
              // if response is undefined but token is there, maybe device is out of order?
              } else if (response === undefined) {
                setDeviceStatus(OperationalState.DEVICE_OUT_OF_ORDER);
              }
            } else {
            // if there is no token try again to get one.
               setDeviceStatus(OperationalState.DEVICE_START_UP);
              }
            break;
          case OperationalState.DEVICE_DISCONNECT:
            if (token) {
              const response = await changeDeviceStatus(token, 'DISCONNECTED');
              if (response) {
                if (response.status === 200) {
                  setDeviceStatus(OperationalState.DEVICE_DISCONNECTED);
                }
              }
            } else {
              // if there is no token try again to get one.
                 setDeviceStatus(OperationalState.DEVICE_START_UP);
              }
            break;      
          case OperationalState.DEVICE_CONNECTED:
            if (token) {
              // If still connected look if scanner needs to be activated
              const newMode = await getSession(token);
              if (newMode.status === 'WAITING_FOR_BARCODE') {
                setDeviceStatus(OperationalState.DEVICE_WAITING_FOR_BARCODE);
              } else {
                checkCounter++;
              }
              // This endpoint need to be called by the device on a regular base to stay in connected state. 
              // In case the status is not updated in time, the internal status will fallback to "not_found"
              // Timeout is set to 60000 on backend. Maybe to put checkcounter dynamically
              if (checkCounter >= 50) {
                response = await changeDeviceStatus(token, 'CONNECTED');
                if (response) {
                  if (response.status !== 200) {
                    setDeviceStatus(OperationalState.DEVICE_COULD_NOT_CONNECT);
                  }
                } else {
                // also if response is undefined. 
                setDeviceStatus(OperationalState.DEVICE_COULD_NOT_CONNECT);
                }
              }
            } else {
                // if there is no token try again to get one.
                   setDeviceStatus(OperationalState.DEVICE_START_UP);
                  }
            break;
          case OperationalState.DEVICE_COULD_NOT_CONNECT:
            // If you cannot connect you probarly also cannot set to DISCONNECT... 
            // either way i put the code here maybe this state can be deleted.
            if (token) {
              response = await changeDeviceStatus(token, 'DISCONNECTED');
              if (response) {
                if (response.status === 200) {
                  setDeviceStatus(OperationalState.DEVICE_DISCONNECTED);
                }
                // if response is undefined but token is there, maybe device is out of order?
              } else if (response === undefined) {
                setDeviceStatus(OperationalState.DEVICE_OUT_OF_ORDER);
              }
            } else {
            // if there is no token try again to get one.
            setDeviceStatus(OperationalState.DEVICE_START_UP);
            }
            break;
          case OperationalState.DEVICE_OUT_OF_ORDER:
            if (token) {
              response = await changeDeviceStatus(token, 'OUT_OF_ORDER');
              if (response) {
                if (response.status === 200) {
                  setDeviceStatus(OperationalState.API_ERROR);
                }
              }
            } else {
              // if there is no token try again to get one.
                 setDeviceStatus(OperationalState.DEVICE_START_UP);
            }
            break;
          case OperationalState.DEVICE_WAITING_FOR_BARCODE:
            if (token) {
              const newMode = await getSession(token);
              if (newMode.status === 'STOPPED') {
                setDeviceStatus(OperationalState.DEVICE_STOPPED);
              }
              if (newMode.status === 'TIMED_OUT') {
                setDeviceStatus(OperationalState.DEVICE_TIMED_OUT);
              }
            } else {
              checkCounter++;
            }
            // either way set to TIMEDOUT
            if (checkCounter >= 13000) {
              setDeviceStatus(OperationalState.DEVICE_TIMED_OUT);
            }
            break;
          case OperationalState.DEVICE_IS_SCANNING:
            if (token) {
              const res = await putScannedData(token, currentQrCode.data);
              if (res === 200) {
                setDeviceStatus(OperationalState.API_SCAN_SUCCESS);
              } else {
                console.log(res);
                setDeviceStatus(OperationalState.API_SCAN_FAILED);
              }
              } else {
                // if there is no token try again to get one. (and start over)
                setDeviceStatus(OperationalState.DEVICE_START_UP);
              }
            break;
          case OperationalState.DEVICE_STOPPED:
          case OperationalState.DEVICE_TIMED_OUT:
          case OperationalState.API_SCAN_SUCCESS:
          case OperationalState.API_SCAN_FAILED:
            init === false
              ? setDeviceStatus(OperationalState.API_ERROR)
              : setDeviceStatus(OperationalState.DEVICE_CONNECT);
            break;
        }
      }, waitTime);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentQrCode.data, deviceStatus, dispatch, getToken, init, state.language, state.statusOption, token]);

  const scanQrButtonHandler = async () => {
    setDeviceStatus(OperationalState.DEVICE_IS_SCANNING);
  };

  return (
    <QrScannerWrapper>
      <InstructionBox>
        {/* {Show loading dots by start-up} */}
        {deviceStatus === OperationalState.DEVICE_START_UP ||
          (deviceStatus === OperationalState.DEVICE_CONNECT && <Loading />)}
        <span> {instructionText}</span>
      </InstructionBox>
      <IconBox>
        {deviceStatus === OperationalState.API_SCAN_SUCCESS && (
          <SuccessIcon width={30} height={30} fill={Sv.green} />
        )}
        {deviceStatus === OperationalState.API_SCAN_FAILED && (
          <CrossIcon width={30} height={30} fill={Sv.red} />
        )}
      </IconBox>
      <ScannerBox>
        
          <AnimatedQr $animate={deviceStatus === OperationalState.DEVICE_IS_SCANNING || deviceStatus === OperationalState.API_SCAN_SUCCESS || deviceStatus === OperationalState.API_SCAN_FAILED}>
            <div><QrCodeIconNoCanvas /></div>
          </AnimatedQr>
        
        <AnimatedCrossHair
          animate={deviceStatus === OperationalState.DEVICE_WAITING_FOR_BARCODE || deviceStatus === OperationalState.DEVICE_IS_SCANNING}
        />
      </ScannerBox>
      <ButtonBox>
        <ScanActionButton
          type="button"
          onClick={scanQrButtonHandler}
          disabled={
            !currentQrCode.name ||
            !currentQrCode.data ||
            deviceStatus !== OperationalState.DEVICE_WAITING_FOR_BARCODE
          }
        >
          <QrCodeIconNoCanvas width={15} height={15} />
          <span>
            {!currentQrCode.name
              ? 'No Qr-Codes'
              : 'Scan: ' + currentQrCode.name}
          </span>
        </ScanActionButton>
      </ButtonBox>
      <GenericFooter>
      <div onClick={() => modusSetterHandler(QrAppModi.SETTINGS)}><SettingsIcon width={16} height={16} /></div>
      <div onClick={() => modusSetterHandler(QrAppModi.QR_CODES)}>
          <QrCodeIcon width={24} height={24} style={{marginRight: '-5px'}}/>
          QRs
        </div>
        <div onClick={() => modusSetterHandler(QrAppModi.NEW_QR)}>
          <AddIcon width={24} height={24} />
        </div>
       
      </GenericFooter>
    </QrScannerWrapper>
  );
};

export default QrCodeReader;

   