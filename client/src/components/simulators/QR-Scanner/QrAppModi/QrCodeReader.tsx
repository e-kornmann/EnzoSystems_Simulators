import styled from 'styled-components';
import SuccessIcon from '../../../shared/Success';
import * as Sv from '../../../../styles/stylevariables';
import { QrAppModi, QrCode } from '..';
import { GenericFooter } from '../../../shared/DraggableModal/ModalTemplate';
import { useCallback, useEffect, useState } from 'react';
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

const AnimatedQr = styled.div`
  width: 40%;
  height: 40%;
  position: absolute;
  left: 30px;
`;

export enum OperationalState {
  DEVICE_START_UP,
  DEVICE_ON,
  DEVICE_OFF,
  DEVICE_CONNECTED,
  DEVICE_DISCONNECTED,
  DEVICE_COULD_NOT_CONNECT,
  DEVICE_OUTOFORDER,
  DEVICE_WAITING_FOR_BARCODE,
  DEVICE_STOPPED,
  DEVICE_TIMEOUT,
  DEVICE_IS_SCANNING,
  API_SCAN_FAILED,
  API_SCAN_SUCCESS,
}

type Props = {
  modusSetterHandler: (modus: QrAppModi) => void;
  currentQrCode: QrCode;
};

const QrCodeReader = ({ modusSetterHandler, currentQrCode }: Props) => {
  const [init, setInit] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState<OperationalState>(
    OperationalState.DEVICE_START_UP
  );
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
          setStandByText(' • •');
          setTimeout(() => {
            setStandByText('ON');
            setInit(true);
            setDeviceStatus(OperationalState.DEVICE_ON);
          }, 500);
        } else {
          setStandByText('ERROR');
          setTimeout(() => {
            setStandByText('OFF');
            setDeviceStatus(OperationalState.DEVICE_OFF);
          }, 4000);
          setInit(false);
        }
      });
    } else if (init) {
      if (token ) {
        const response = await changeDeviceStatus(token, 'DISCONNECTED');
        if (response) {
          if (response.status === 200) {
            setDeviceStatus(OperationalState.DEVICE_DISCONNECTED);
            setInit(false);
            setStandByText('OFF');
          }
        }
      }
      } else {
      // eiter way, turn device off
      setInit(false);
      setStandByText('OFF');
      setDeviceStatus(OperationalState.DEVICE_OFF);
    }
  }, [init, logOn, token]);

  useEffect(() => {
    let waitTime: number | undefined = undefined;
    let intervalId: NodeJS.Timer | null = null;

    let checkCounter = 0; // Counter for the number of checks

    switch (deviceStatus) {
      case OperationalState.DEVICE_START_UP:
        logInButtonHandler();
        break;
      case OperationalState.DEVICE_ON:
        setInstructionText('');
        waitTime = 1000;
        break;
      case OperationalState.DEVICE_DISCONNECTED:
        setInstructionText('DISCONNECTED');
        waitTime = 3000;
        break;
      case OperationalState.DEVICE_OFF:
        setInstructionText('Turn on device');
        break;
      case OperationalState.DEVICE_OUTOFORDER:
        setInstructionText(ts('outOfOrder', Lang.ENGLISH));
        waitTime = 3000;
        break;
      case OperationalState.DEVICE_CONNECTED:
        setInstructionText(`Device CONNECTED,\nbut not activated`);
        waitTime = 500;
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
      case OperationalState.DEVICE_TIMEOUT:
        setInstructionText('TIME OUT');
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
          case OperationalState.DEVICE_ON:
            if (token) {
              response = await changeDeviceStatus(token, 'CONNECTED');
              if (response) {
                if (response.status !== 200) {
                  setDeviceStatus(OperationalState.DEVICE_COULD_NOT_CONNECT);
                } else if (response.status === 200) {
                  setDeviceStatus(OperationalState.DEVICE_CONNECTED);
                }
              // if response is undefined but token is there, maybe device is out of order?
              } else if (response === undefined) {
                setDeviceStatus(OperationalState.DEVICE_OUTOFORDER);
              }
            }
            break;
          case OperationalState.DEVICE_DISCONNECTED:
            setDeviceStatus(OperationalState.DEVICE_OFF);
            break;
          case OperationalState.DEVICE_CONNECTED:
            if (token) {
              // if still connected look if scanner needs to be activated
              const newMode = await getSession(token);
              if (newMode.status === 'WAITING_FOR_BARCODE') {
                setDeviceStatus(OperationalState.DEVICE_WAITING_FOR_BARCODE);
              } else {
                checkCounter++;
              }
              // This endpoint need to be called by the device on a regular base to stay in the requested status. In the case the status is not updated in time, the internal status will fallback to "not_found"
              if (checkCounter >= 110) {
                response = await changeDeviceStatus(token, 'CONNECTED');
                if (response) {
                  if (response.status !== 200) {
                    setDeviceStatus(OperationalState.DEVICE_COULD_NOT_CONNECT);
                    }
                  }
                }
              }
            break;
          case OperationalState.DEVICE_COULD_NOT_CONNECT:
            if (token) {
              response = await changeDeviceStatus(token, 'DISCONNECTED');
              if (response) {
                if (response.status === 200) {
                  setDeviceStatus(OperationalState.DEVICE_DISCONNECTED);
                }
              // if response is undefined but token is there, maybe device is out of order?
              } else if (response === undefined) {
                setDeviceStatus(OperationalState.DEVICE_OUTOFORDER);
              }
            }
            break;
          case OperationalState.DEVICE_OUTOFORDER:
            if (token) {
              response = await changeDeviceStatus(token, 'OUT_OF_ORDER');
              if (response) {
                if (response.status === 200) {
                  setDeviceStatus(OperationalState.DEVICE_OFF);
                }  
              }
            }
              setDeviceStatus(OperationalState.DEVICE_ON);
              break;
          case OperationalState.DEVICE_WAITING_FOR_BARCODE:
            if (token) {
              const newMode = await getSession(token);
              if (newMode.status === 'STOPPED') {
                setDeviceStatus(OperationalState.DEVICE_STOPPED);
              }
              if (newMode.status === 'TIMED_OUT') {
                setDeviceStatus(OperationalState.DEVICE_TIMEOUT);
              }
              } else {
                checkCounter++;
              }
              // either way set to TIMEDOUT
              if (checkCounter >= 13000) {
                setDeviceStatus(OperationalState.DEVICE_TIMEOUT);
              }
            break;
          case OperationalState.DEVICE_IS_SCANNING:
            if (token) {
              const res = await putScannedData(token, currentQrCode.data);
              if (res.status === 'FINISHED')
                setDeviceStatus(OperationalState.API_SCAN_SUCCESS);
            }
            break;
          case OperationalState.DEVICE_STOPPED:
          case OperationalState.DEVICE_TIMEOUT:
          case OperationalState.API_SCAN_SUCCESS:
          case OperationalState.API_SCAN_FAILED:
            init === false
              ? setDeviceStatus(OperationalState.DEVICE_OFF)
              : setDeviceStatus(OperationalState.DEVICE_ON);
            break;
        }
      }, waitTime);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentQrCode.data, deviceStatus, init, logInButtonHandler, token]);

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
          (deviceStatus === OperationalState.DEVICE_ON && <Loading />)}
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
        {deviceStatus === OperationalState.DEVICE_IS_SCANNING && (
          <AnimatedQr>
            <QrCodeIcon width={130} height={130} />
          </AnimatedQr>
        )}
        <AnimatedCrossHair
          animate={deviceStatus === OperationalState.DEVICE_WAITING_FOR_BARCODE}
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
        <div onClick={() => modusSetterHandler(QrAppModi.NEW_QR)}>
          <AddIcon />
          New
        </div>
        <div onClick={() => modusSetterHandler(QrAppModi.QR_CODES)}>
          <QrCodeIcon />
          QRs
        </div>
      </GenericFooter>
    </QrScannerWrapper>
  );
};

export default QrCodeReader;

   