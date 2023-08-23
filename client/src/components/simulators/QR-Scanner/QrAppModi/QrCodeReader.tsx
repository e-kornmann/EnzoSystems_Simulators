import styled, { keyframes } from 'styled-components';
import SuccessIcon from '../../../shared/Success';
import * as Sv from '../../../../styles/stylevariables';
import { QrAppModi, QrCode } from '..';
import { GenericFooter } from '../../../shared/DraggableModal/ModalTemplate';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ReactComponent as QrCodeIcon } from '../../../../assets/svgs/qr_code.svg';
import { ReactComponent as AddIcon } from '../../../../assets/svgs/add.svg';
import ts from '../Translations/translations';
import { Lang } from '../../PaymentDevice/DeviceSettings/AvailableSettings/LanguageOptions';
import { Loading } from '../../../shared/Loading';
import AnimatedCrossHair from './AnimatedCrossHair';
import useLogOn from '../../../../hooks/useLogOn';
import { reqBody, scannerCredentials } from '../config';
import TurnOnDevice from '../../../shared/TurnOnDevice';
import { changeDeviceStatus } from '../utils/changeDeviceStatus';
import { putScannedData } from '../utils/putScannedData';
import CrossIcon from '../../../shared/Fail';
import { getSession } from '../utils/getSession';
import { ReactComponent as SettingsIcon } from '../../../../assets/svgs/settings.svg';
import { AppContext, SettingModes } from '../utils/settingsReducer';
import { OperationalModeOptionsType } from './DeviceSettings/AvailableSettings/OperationalModeOptions';

const QrScannerWrapper = styled.div`
  display: grid;
  grid-template-rows: 14% 16% 1fr 20% auto;
  row-gap: 2%;
`;


const InstructionBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  & > span {
    white-space: pre-line;
    text-align: center;
    font-size: 1.15em;
    line-height: 1.23em;
    font-weight: 500;
  }
`;
const IconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;
const ScannerBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;
const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: hidden;
`;
const ScanActionButton = styled.button`
  background-color: ${Sv.enzoOrange};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 85%;
  height: 50%;
  border-radius: 2px;
  cursor: pointer;
  z-index: 300;
  border-radius: 6px;
  &:active {
    background-color: ${Sv.enzoDarkOrange};
  }
  & > span {
    font-weight: 300;
    font-size: 0.9em;
    color: white;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 70%;
  }
  & > svg {
    position: relative;
    top: -1px;
    fill: white;
    margin-right: 8px;
  }
  &:disabled {
    background-color: ${Sv.gray};
    cursor: inherit;
    &:active {
      background-color: ${Sv.gray};
    }
  }
`;


const blinkAnimation = keyframes`
0% {
  opacity: 0;
  transform: translateX(-250px);
}

10%, 90% {
  opacity: 1;
  transform: translateX(0px);
}

35%, 65% {
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
  transform: translateX(250px);
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
    padding: 20px;
    background-color: white;
    animation: ${blinkAnimation} 5s ease 0s 1 normal forwards;
    border-radius: 3px;
     & > svg {
      width: 100%;
      height: 100%;
     }
    }

`;

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
  const [deviceStatus, setDeviceStatus] = useState<OperationalState>(
    OperationalState.DEVICE_START_UP
  );

  useEffect(() => {
    // connect when Connected settings in initiated.
    if (state.operationalModeOption === OperationalModeOptionsType.CONNECTED) {
      // if you are already logged in
      init ? setDeviceStatus(OperationalState.DEVICE_CONNECT) : setDeviceStatus(OperationalState.DEVICE_START_UP)
    }
    // disconnect when Connected settings in initiated.
    if (state.operationalModeOption === OperationalModeOptionsType.DISCONNECTED) setDeviceStatus(OperationalState.DEVICE_DISCONNECT);
  }, [init, state.operationalModeOption])


  const [instructionText, setInstructionText] = useState('');
  const { token, logOn } = useLogOn(
    scannerCredentials,
    reqBody,
    'barcode-scanner'
  );
  const [standByText, setStandByText] = useState<string>('OFF');

  const logInButtonHandler = useCallback(async () => {
    if (!init) {
      await logOn().then((success) => {
        if (success) {
          setTimeout(() => {

            setInit(true);
            setDeviceStatus(OperationalState.DEVICE_CONNECT);
          }, 500);
        } else {
          setStandByText('ERROR');
          setTimeout(() => {
            setDeviceStatus(OperationalState.API_ERROR);
          }, 4000);
        }
      });
    } else if (init) {
      setInit(false);
      setStandByText('OFF');
      setDeviceStatus(OperationalState.DEVICE_OUT_OF_ORDER);
    }
  }, [init, logOn]);

  useEffect(() => {
    let waitTime: number | undefined = undefined;
    let intervalId: NodeJS.Timer | null = null;

    let checkCounter = 0; // Counter for the number of checks

    switch (deviceStatus) {
      case OperationalState.DEVICE_START_UP:
        logInButtonHandler();
        break;
      case OperationalState.API_ERROR:
        setInstructionText('SERVER ERROR');
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
        setInstructionText(`Device DISCONNECTED,\nConnect device`);
        if (state.operationalModeOption !== OperationalModeOptionsType.DISCONNECTED) {
          dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: OperationalModeOptionsType.DISCONNECTED })
        }
        break;
      case OperationalState.DEVICE_OUT_OF_ORDER:
        setInstructionText(ts('outOfOrder', Lang.ENGLISH));
        waitTime = 3000;
        break;
      case OperationalState.DEVICE_CONNECTED:
        setInstructionText(`Device CONNECTED,\nbut not activated`);
        waitTime = 1000;
        break;
      case OperationalState.DEVICE_COULD_NOT_CONNECT:
        setInstructionText('DEVICE COULD NOT CONNECT');
        waitTime = 3500;
        break;
      case OperationalState.DEVICE_WAITING_FOR_BARCODE:
        setInstructionText(ts('readyToScan', Lang.ENGLISH));
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
        waitTime = 5500;
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
          case OperationalState.DEVICE_CONNECT:
            if (token) {
              response = await changeDeviceStatus(token, 'CONNECTED');
              if (response) {
                if (response.status !== 200) {
                  setDeviceStatus(OperationalState.DEVICE_COULD_NOT_CONNECT);
                } else if (response.status === 200) {
                  setDeviceStatus(OperationalState.DEVICE_CONNECTED);
                  // update Settings because initial state is OUT_OF_ORDER
                  dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: OperationalModeOptionsType.CONNECTED })
                }
              // if response is undefined but token is there, maybe device is out of order?
              } else if (response === undefined) {
                setDeviceStatus(OperationalState.DEVICE_OUT_OF_ORDER);
              }
            } else {
            // if there is no token try to again to get one.
               setDeviceStatus(OperationalState.DEVICE_START_UP);
              }
            break;
          case OperationalState.DEVICE_DISCONNECT:
            if (token) {
              const response = await changeDeviceStatus(token, 'DISCONNECTED');
              if (response) {
                if (response.status === 200) {
                  setDeviceStatus(OperationalState.DEVICE_DISCONNECTED);
                  setInit(false);
                  setStandByText('OFF');
                }
              }
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
                  }
                }
              } else {
                // if there is no token try to again to get one.
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
            }
            // if there is no token try again to get one.
            setDeviceStatus(OperationalState.DEVICE_START_UP);
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
                setDeviceStatus(OperationalState.API_SCAN_FAILED);
              }
              } else {
                // if there is no token try to again to get one. (and start over)
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
  }, [currentQrCode.data, deviceStatus, dispatch, init, logInButtonHandler, state.operationalModeOption, token]);

  const scanQrButtonHandler = async () => {
    setDeviceStatus(OperationalState.DEVICE_IS_SCANNING);
  };

  return (
    <QrScannerWrapper>
      <TurnOnDevice
        init={init}
        logInButtonHandler={logInButtonHandler}
        standByText={standByText}
      />
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
        
          <AnimatedQr $animate={deviceStatus === OperationalState.DEVICE_IS_SCANNING}>
            <div><QrCodeIcon width={130} height={130} /></div>
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
          <QrCodeIcon width={15} height={15} />
          <span>
            {!currentQrCode.name
              ? 'No Qr-Codes'
              : 'Scan: ' + currentQrCode.name}
          </span>
        </ScanActionButton>
      </ButtonBox>
      <GenericFooter>
      <div><SettingsIcon width={13} height={13} onClick={()=>{modusSetterHandler(QrAppModi.SETTINGS)}} /></div>
      <div onClick={() => modusSetterHandler(QrAppModi.QR_CODES)}>
          <QrCodeIcon width={14} height={14} fill={'red'} />
          QRs
        </div>
        <div onClick={() => modusSetterHandler(QrAppModi.NEW_QR)}>
          <AddIcon width={12} height={12} />
          New
        </div>
       
      </GenericFooter>
    </QrScannerWrapper>
  );
};

export default QrCodeReader;

   