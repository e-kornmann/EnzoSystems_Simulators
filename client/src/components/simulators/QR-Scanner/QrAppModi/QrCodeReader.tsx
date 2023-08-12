import styled from "styled-components";
import SuccessIcon from "../../../shared/Success";
import * as Sv from "../../../../styles/stylevariables";
import { QrAppModi, QrCode } from "..";
import { GenericFooter } from "../../../shared/DraggableModal/ModalTemplate";
import { useCallback, useEffect, useState } from "react";
import { ReactComponent as QrCodeIcon } from '../../../../assets/svgs/qr_code.svg'
import { ReactComponent as AddIcon } from '../../../../assets/svgs/add.svg'
import ts from "../Translations/translations";
import { Lang } from "../../PaymentDevice/DeviceSettings/AvailableSettings/LanguageOptions";
import { Loading } from "../../../shared/Loading";
import AnimatedCrossHair from "./AnimatedCrossHair";
import useLogOn from "../../../../hooks/useLogOn";
import { reqBody, scannerCredentials } from "../config";
import TurnOnDevice from "../../../shared/TurnOnDevice";
import { setApiStatusConnected } from "../utils/setApiStatusConnected";

const QrScannerWrapper = styled.div`
  display: grid;
  grid-template-rows: 14% 16% 1fr 20% auto; 
  row-gap: 2%;
`
const InstructionBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  & > span {
  white-space: pre-line;
  text-align: center;
  font-size: 1.25em;
  font-weight: 500;
  } 
`
const IconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`
const ScannerBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`
const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow-y: hidden;
`
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

  export enum OperationalState {
    DEVICE_START_UP,
    DEVICE_LOGGED_OFF,
    DEVICE_INIT,
    DEVICE_CONNECTED,
    DEVICE_COULD_NOT_CONNECT,
    API_ENABLED,
    API_OUTOFORDER,
    API_DISABLED,
    API_SCANFAILED,
    API_SCANSUCCESS,
  }


type Props = {
  modusSetterHandler: (modus: QrAppModi) => void;
  currentQrCode: QrCode;
}
const QrCodeReader = ({modusSetterHandler, currentQrCode }: Props) => {
  const [deviceStatus, setDeviceStatus] = useState<OperationalState>(OperationalState.DEVICE_START_UP);
  const [instructionText, setInstructionText] = useState('');
  const { token, logOn } = useLogOn(scannerCredentials, reqBody, 'barcode-scanner');
  const [standByText, setStandByText] = useState<string>('OFF')
  const [init, setInit] = useState(false);
  


  
  
  const logInButtonHandler = useCallback(async () => {
    if (!init) {
      try {
        await logOn()
          .then((success) => {
            if (success) {
              setInit(true); 
              setStandByText(' • •');  
              setTimeout(() => {setStandByText('ON')}, 500);   
              } else {
              setStandByText('ERROR');  
              setTimeout(() => {
                  setStandByText('OFF');   
              }, 4000); 
              setInit(false);
            } 
          });
      } catch (error) {
        console.error("Error during login:", error);
      }
    } else {
      setInit(false);
      setStandByText('OFF');
    }
  }, [init, logOn])

 
  useEffect(() => {

    let waitTime: number | undefined = undefined;
    let intervalId: NodeJS.Timer | null = null;
    let isApiEnabledReqStatusCode: number | undefined = undefined;
    let checkCounter = 0; // Counter for the number of checks


    switch (deviceStatus) {
      case OperationalState.DEVICE_START_UP:
        logInButtonHandler();
        init === false ? setDeviceStatus(OperationalState.API_OUTOFORDER) : setDeviceStatus(OperationalState.DEVICE_INIT);
        break;
      // if there is a problem logging in
      case OperationalState.API_OUTOFORDER:
        setInstructionText(ts('outOfOrder', Lang.ENGLISH));
        waitTime = 1000;
        break;
      case OperationalState.DEVICE_INIT:
        setInstructionText('');  
        waitTime = 1500;
        break;
      case OperationalState.DEVICE_CONNECTED:
        setInstructionText(`Device CONNECTED,\nbut not activated`);
        break;
      case OperationalState.DEVICE_COULD_NOT_CONNECT:
        setInstructionText('DEVICE COULD NOT CONNECT');
        waitTime = 3500;
        break;
      case OperationalState.API_ENABLED:
        setInstructionText(ts('readyToScan', Lang.ENGLISH));
        waitTime = 800;
        checkCounter = 0; 
        break;
      case OperationalState.API_DISABLED:
        setInstructionText('ACTIVATE DEVICE');
        waitTime = 800; // Set wait time to 1 second for initial check
        checkCounter = 0; // Reset the check counter
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
          case OperationalState.API_OUTOFORDER:
            init === false ? setDeviceStatus(OperationalState.API_OUTOFORDER) : setDeviceStatus(OperationalState.DEVICE_INIT);
            break;
          case OperationalState.DEVICE_INIT:
              if (token) {
              response = await setApiStatusConnected(token);
               if ( response !== 200) {
                 setDeviceStatus(OperationalState.DEVICE_COULD_NOT_CONNECT);
               } else {
                 setDeviceStatus(OperationalState.DEVICE_CONNECTED);
               }
             }
            break;
          case OperationalState.DEVICE_COULD_NOT_CONNECT:
                setDeviceStatus(OperationalState.DEVICE_INIT);
            break;




          case OperationalState.API_ENABLED:
            isApiEnabledReqStatusCode = 200;
            if (isApiEnabledReqStatusCode !== 200) {
              setDeviceStatus(OperationalState.API_DISABLED);
            } else {
              // Increment the check counter
              checkCounter++;
  
              if (checkCounter >= 1) {
                // If not successful for 5 seconds, transition to DEVICE_START_UP
                setDeviceStatus(OperationalState.DEVICE_START_UP);
              }
            }
            break;
          case OperationalState.API_DISABLED:
              isApiEnabledReqStatusCode = 400;
              if (isApiEnabledReqStatusCode === 200) {
                setDeviceStatus(OperationalState.API_ENABLED);
              } else {
                // Increment the check counter
                checkCounter++;
    
                if (checkCounter >= 1) {
                  // If not successful for 5 seconds, transition to DEVICE_START_UP
                  setDeviceStatus(OperationalState.DEVICE_START_UP);
                }
              }
              break;

        }
      }, waitTime);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [deviceStatus, init, logInButtonHandler, token]);

 


  return (
    
    <QrScannerWrapper>    
      <TurnOnDevice init={init} logInButtonHandler={logInButtonHandler} standByText={standByText} />
      <InstructionBox>
      
      {/* {Show loading dots by start-up} */}
      { deviceStatus === OperationalState.DEVICE_START_UP || deviceStatus === OperationalState.DEVICE_INIT && <Loading />}  
       <span> { instructionText }</span></InstructionBox>
      <IconBox>{ deviceStatus === OperationalState.API_SCANSUCCESS ? <SuccessIcon width={30} height={30} fill={Sv.green} /> : null }</IconBox>
      <ScannerBox><AnimatedCrossHair animate={deviceStatus === OperationalState.API_ENABLED}/></ScannerBox>
     <ButtonBox> 
      <ScanActionButton type="button" onClick={()=>(true)} disabled={!currentQrCode.name || !currentQrCode.data}>
        <QrCodeIcon width={15} height={15} /><span>{ !currentQrCode.name ? 'No Qr-Codes' : currentQrCode.name }</span></ScanActionButton>
     </ButtonBox>
    <GenericFooter>
        <div onClick={()=> modusSetterHandler(QrAppModi.NEW_QR)}><AddIcon/>New</div>
        <div onClick={()=> modusSetterHandler(QrAppModi.QR_CODES)}><QrCodeIcon />QRs</div>
    </GenericFooter>
  </QrScannerWrapper>

  );
};

export default QrCodeReader;
  