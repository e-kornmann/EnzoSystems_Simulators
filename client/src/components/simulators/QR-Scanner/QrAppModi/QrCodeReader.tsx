import styled from "styled-components";
import SuccessIcon from "../../../shared/Success";
import * as Sv from "../../../../styles/stylevariables";
import { ReactComponent as CloseIcon } from '../../../../assets/svgs/close.svg'
import { ReactComponent as Arrow } from '../../../../assets/svgs/arrow_back.svg'
import { Container, GenericFooter, Header } from "../../../shared/DraggableModal/ModalTemplate";
import { useCallback, useEffect, useState } from "react";
import { ReactComponent as QrCodeIcon } from '../../../../assets/svgs/qr_code.svg'
import { ReactComponent as AddIcon } from '../../../../assets/svgs/add.svg'
import ts from "../Translations/translations";
import { Lang } from "../../PaymentDevice/DeviceSettings/AvailableSettings/LanguageOptions";
import { Loading } from "../../../shared/Loading";
import { isApiEnabledRequest } from "../utils/isApiEnabledRequest";
import AnimatedCrossHair from "./AnimatedCrossHair";
import { setApiStatusConnected } from "../utils/setApiStatusConnected";
import useLogOn from "../../../../hooks/useLogOn";
import TurnOnDevice from "../../../shared/TurnOnDevice";
import { scannerCredentials, reqBody } from "../config";
import DemoApp from "../host/host";
import QrForm from "./QrForm";
import QrCodes from "./QrCodes";


const QrScannerWrapper = styled.div`
  height: 100%;
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
  font-size: 1.25em;
  font-weight: 500;
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


  export enum QrAppModi {
    QR_SCANNER = 'qrCodeReader',
    NEW_QR = 'newQrForm',
    EDIT_LIST = 'editQrList',
    EDIT_QR = 'editQrForm',
    DEL_QR = 'deleteQr',
    QR_CODES = 'qrCodes',
  }
  
  export type QrCode = {
    name: string;
    data: string;
  }
  
  const NavigationHeader = styled(Header)`  
    padding: 0 8px 0 9px;
    justify-content: space-between;
  `;

  const QrCodeReader = () => {
      
    const modusSetterHandler = () => console.log('fsda');
    const [deviceStatus, setDeviceStatus] = useState<OperationalState>(OperationalState.DEVICE_START_UP);
    const [instructionText, setInstructionText] = useState('');
    const [currentModus, setCurrentModus] = useState(QrAppModi.QR_SCANNER);
    const { token, logOn } = useLogOn(scannerCredentials, reqBody, 'barcode-scanner');
    const [standByText, setStandByText] = useState<string>('OFF')
    const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
    const [currentQrCode, setCurrentQrCode] = useState<QrCode>({ name: '', data: '' });
    const [qrCodeToEdit, setQrCodeToEdit] = useState<QrCode>({ name: '', data: '' });
    const [init, setInit] = useState(false);
    const [showQrFormComponent, setShowQrFormComponent] = useState(false);
    const [showQrEditComponent, setShowQrEditComponent] = useState(false);
    const [showQrCodesComponent, setShowQrCodesComponent] = useState(false);
  
    useEffect(() => {
      setShowQrFormComponent(currentModus === QrAppModi.NEW_QR);
      setShowQrEditComponent(currentModus === QrAppModi.EDIT_QR);
      setShowQrCodesComponent(
        currentModus === QrAppModi.QR_CODES ||
        currentModus === QrAppModi.EDIT_LIST ||
        currentModus === QrAppModi.DEL_QR
      );
    }, [currentModus]);
    




 

  useEffect(() => {
    let waitTime: number | undefined = undefined;
    let intervalId: NodeJS.Timer | null = null;
    let isApiEnabledReqStatusCode: number | undefined = undefined;
    let checkCounter = 0; 

    switch (deviceStatus) {
            
      case OperationalState.DEVICE_START_UP:
        setInstructionText('');
        waitTime = 600;
        break;
      case OperationalState.DEVICE_INIT:
        setInstructionText('Trying to connect');
        waitTime = 2000;
        break;
      case OperationalState.DEVICE_CONNECTED:
        setInstructionText('DEVICE CONNECTED BUT NOT ACTIVATED');
        break;
      case OperationalState.DEVICE_COULD_NOT_CONNECT:
        setInstructionText('DEVICE COULD NOT CONNECT');
        waitTime = 2000;
        break;
      case OperationalState.API_OUTOFORDER:
        setInstructionText(ts('outOfOrder', Lang.ENGLISH));
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
          case OperationalState.DEVICE_START_UP:
            init === false ? setDeviceStatus(OperationalState.API_OUTOFORDER) : setDeviceStatus(OperationalState.DEVICE_INIT)
            break;
          case OperationalState.DEVICE_INIT:
             if (token) {
             response = await setApiStatusConnected(token);
              if ( response === undefined) {
                setDeviceStatus(OperationalState.DEVICE_COULD_NOT_CONNECT);
              } else {
                setDeviceStatus(OperationalState.DEVICE_CONNECTED);
              }
            }
              break;
            // isApiEnabledReqStatusCode = await isApiEnabledRequest(hostIsEnabled);
            // (isApiEnabledReqStatusCode === 200) ? setDeviceStatus(OperationalState.API_ENABLED) : setDeviceStatus(OperationalState.API_DISABLED)
            // break;
          case OperationalState.API_ENABLED:
            isApiEnabledReqStatusCode = await isApiEnabledRequest(true);
            if (isApiEnabledReqStatusCode !== 200) {
              setDeviceStatus(OperationalState.API_DISABLED);
            } else {
              // Increment the check counter
              checkCounter++;
  
              if (checkCounter >= 35) {
                // If not successful for 5 seconds, transition to DEVICE_START_UP
                setDeviceStatus(OperationalState.DEVICE_START_UP);
              }
            }
            break;
          case OperationalState.API_DISABLED:
              isApiEnabledReqStatusCode = await isApiEnabledRequest(true);
              if (isApiEnabledReqStatusCode === 200) {
                setDeviceStatus(OperationalState.API_ENABLED);
              } else {
                // Increment the check counter
                checkCounter++;
    
                if (checkCounter >= 35) {
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
  }, [deviceStatus, init, token]);


  const logInButtonHandler = useCallback(async () => {
    if (!init) {
      try {
        await logOn()
          .then((success) => {
            if (success) {
              setStandByText(' • •');  
              setTimeout(() => {setStandByText('ON')}, 500);   
              setInit(true); 
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
  }, [init, logOn]);



  const saveNewQrCodeHandler = (newQrCode: QrCode) => {
    if (currentModus === QrAppModi.NEW_QR) {
      setQrCodes([...qrCodes, newQrCode]);
      setCurrentQrCode(newQrCode);
      setCurrentModus(QrAppModi.QR_SCANNER);
    }
    if (currentModus === QrAppModi.EDIT_QR) {
      const updatedQrCodes = qrCodes.map((qr) =>
        qr.name === newQrCode.name ? newQrCode : qr
      );
      setQrCodes(updatedQrCodes);
      setCurrentQrCode(newQrCode);
      setCurrentModus(QrAppModi.QR_SCANNER);
    }
  };

  const deleteQrCodesHandler = (qrCodesToDelete: QrCode[]) => {
    const updatedQrCodes = qrCodes.filter(qrCode =>
      !qrCodesToDelete.includes(qrCode)
    );
    setQrCodes(updatedQrCodes);
    setCurrentModus(QrAppModi.QR_CODES);
  };

  const selectQrCodeHandler = (selectedQrCode: QrCode) => {
    if (currentModus === QrAppModi.QR_CODES) {
      setCurrentQrCode(selectedQrCode);
      setTimeout(() => setCurrentModus(QrAppModi.QR_SCANNER), 100);
    }
    if (currentModus === QrAppModi.EDIT_LIST) {
      setQrCodeToEdit(selectedQrCode);
      setCurrentQrCode(selectedQrCode);
      setCurrentModus(QrAppModi.EDIT_QR);
    }
  };

  return (
    <Container>
        {showQrFormComponent && (
        <QrForm
          saveNewQrCodeHandler={saveNewQrCodeHandler}
          isEditMode={false}
        />
      )}

      {/* Render QrForm for editing conditionally */}
      {showQrEditComponent && (
        <QrForm
          saveNewQrCodeHandler={saveNewQrCodeHandler}
          isEditMode={true}
          qrCodeToEdit={qrCodeToEdit}
        />
      )}

      {/* Render QrCodes component conditionally */}
      {showQrCodesComponent && (
        <QrCodes
          currentModus={currentModus}
          deleteQrCodesHandler={deleteQrCodesHandler}
          modusSetterHandler={modusSetterHandler}
          qrCodes={qrCodes}
          selectQrCodeHandler={selectQrCodeHandler}
          currentQrCode={currentQrCode}
        />
      )}
      <TurnOnDevice init={init} logInButtonHandler={logInButtonHandler} standByText={standByText} />
      <DemoApp />
      <NavigationHeader>
        <div>
          {currentModus === QrAppModi.EDIT_QR ||
            currentModus === QrAppModi.DEL_QR &&
            <Arrow width={12} height={12} onClick={() => setCurrentModus(QrAppModi.QR_CODES)} style={{ top: '2px' }} />}
        </div>
        {ts(currentModus, Lang.ENGLISH)}
        <div>
          {currentModus !== QrAppModi.QR_SCANNER &&
            <CloseIcon width={11} height={11} onClick={() => { setCurrentModus(QrAppModi.QR_SCANNER) }} />}
        </div>
      </NavigationHeader>
    
      <QrScannerWrapper>    
        <InstructionBox>
          {deviceStatus === OperationalState.DEVICE_START_UP && <Loading />}  
          {instructionText}
        </InstructionBox>
        <IconBox>
          {deviceStatus === OperationalState.API_SCANSUCCESS && <SuccessIcon width={30} height={30} fill={Sv.green} />}
        </IconBox>
        <ScannerBox>
          <AnimatedCrossHair animate={deviceStatus === OperationalState.API_ENABLED}/>
        </ScannerBox>
        <ButtonBox> 
          <ScanActionButton type="button" onClick={()=>(true)} disabled={!currentQrCode.name || !currentQrCode.data}>
            <QrCodeIcon width={15} height={15} />
            <span>{!currentQrCode.name ? 'No Qr-Codes' : currentQrCode.name }</span>
          </ScanActionButton>
        </ButtonBox>
        <GenericFooter>
          <div onClick={()=> setCurrentModus(QrAppModi.NEW_QR)}><AddIcon/>New</div>
          <div onClick={()=> setCurrentModus(QrAppModi.QR_CODES)}><QrCodeIcon />QRs</div>
        </GenericFooter>
      </QrScannerWrapper>


            
  </Container>
  );
}

export default QrCodeReader;
  






