import { useCallback, useEffect, useRef, useState } from 'react';
import * as Sv from '../../../../styles/stylevariables';
import { Header } from '../../../shared/DraggableModal/ModalTemplate'
import styled, { keyframes } from "styled-components";
import { ReactComponent as CrossHairIcon } from '../../../../assets/svgs/crosshair.svg'
import TurnOnDevice from '../../../shared/TurnOnDevice';
import useLogOn from '../../../../hooks/useLogOn';
import { hostCredentials, reqBody } from '../../DemoApp/config';
import { getStatus } from './utils/getStatus';
import { changeDeviceMode } from './utils/setDeviceMode';
import { getScannedData } from './utils/getScannedData';

const DemoAppContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  position: absolute;
  width: 130px;
  left: 300px;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  overflow-y: sunset;
  background-color: ${Sv.appBackground};
`
const blinkAnimation = keyframes`
  90%, 100% {
    opacity: 1;
  }
  10% {
    opacity: 0;
  }
`
const BlinkingDot = styled.div<{ $isActive: boolean }>`
  position: absolute;
  width: 6px;
  height: 6px;
  background-color: ${(props) => (props.$isActive ? Sv.green : 'transparent')};
  border-radius: 100px;
  margin: 5px 4px;
  animation-name: ${blinkAnimation};
  animation-duration: 1.0s;
  animation-iteration-count: infinite;
  }
`

const Content = styled.div`
  display: flex;
  padding: 5px 5px;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  overflow-y: sunset;
`

const Wrap = styled.div<{ $isActive: boolean, $isEnabled: boolean }>`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    row-gap: 8px;
    height: 100px;
    flex-direction: column;
    & > span {
      padding: 3px;
      font-size: 0.75em;
      font-weight: 800;
      text-align: center;
      color: ${Sv.asphalt};
    }
    & > button {
        height: 32px;
        width: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        background-color: ${Sv.asphalt};
        border-radius: 5px;
        cursor: pointer;
        & > svg {
          height: 18px;
          width: 18px;
          fill: ${(props) => (props.$isEnabled ? 'limegreen' : Sv.gray)};
        }
    
        &:disabled { 
          cursor: inherit;
          background-color: ${Sv.gray};
          & > svg {
            fill: ${Sv.appBackground};
          }
        }
    }
   
    `

const GetDeviceStatusText = styled.div`
    display: flex;
    font-size: 0.75em;    
    font-weight: 400;
    justify-content: center;
    text-align: center;
    margin-top: 10px;
    align-items: center;
    white-space: pre-line; 
  `


  const QrData = styled.div`
  display: grid;
  grid-template-rows: 20px 160px;
  padding: 10px;

  `

  const QrDataHeader = styled.div`
  color: white;
  padding: 4px 6px;
  font-size: 0.82em;
  background-color: ${Sv.asphalt}; 
  border-bottom: 1px solid  ${Sv.appBackground};
  border-radius: 3px 3px 0 0;
  
`
const QrDataContent = styled.div`
  color: white;
  padding: 4px 6px;
  font-size: 0.82em;
  background-color: ${Sv.asphalt}; 
  border-radius: 0 0 3px 3px;
`



export enum DeviceMode {
  DEVICE_ENABLED,
  DEVICE_DISABLED,
}



const DemoApp = () => {
  const { token, logOn } = useLogOn(hostCredentials, reqBody, 'barcode-scanner');
  const [deviceStatus, setDeviceStatus] = useState('disconnected');
  const [deviceMode, setDeviceMode] = useState(DeviceMode.DEVICE_DISABLED);
  const [standByText, setStandByText] = useState<string>('OFF')
  const [init, setInit] = useState(false);
  const [scannedData, setScannedData] = useState('');
  // use this ref for the first useEffect below
  const initRef = useRef(false);


  const logInButtonHandler = useCallback(async () => {
    if (!init) {
      await logOn()
        .then((success) => {
          if (success) {
            setStandByText(' • •');
            setTimeout(() => { setStandByText('ON') }, 500);
            setInit(true);
          } else {
            setStandByText('ERROR');
            setTimeout(() => {
              setStandByText('OFF');
            }, 2000);
            setInit(false);
            }
          })
      } else {
        setInit(false);
        setStandByText('OFF');
      }
    }, [init, logOn]);


    // automatically initiate logInButtonHandler ONCE when component is rendered.
    useEffect(() => {
      if (!initRef.current) {
        initRef.current = true;
        setTimeout(async() => await logInButtonHandler(), 3500);
      }
    }, [logInButtonHandler]);
  
  
  const enableDeviceButtonHandler = async () => {
    if (token) {
      if (init && deviceMode === DeviceMode.DEVICE_DISABLED) {
        const enableResponse = await changeDeviceMode(token, 'enabled');
        if (enableResponse === 200) {
          setDeviceMode(DeviceMode.DEVICE_ENABLED);
  
          // After a successful enable, automatically disable the devive after 12 seconds
          setTimeout(async () => {
            const disableResponse = await changeDeviceMode(token, 'disabled');
            if (disableResponse === 200) {
              setDeviceMode(DeviceMode.DEVICE_DISABLED);
            }
          }, 12000);      
        }
      } else if (init && deviceMode === DeviceMode.DEVICE_ENABLED) {
        const disableResponse = await changeDeviceMode(token, 'disabled');
        if (disableResponse === 200) {
          setDeviceMode(DeviceMode.DEVICE_DISABLED);
        } 
      }
    }
  };
  
  // check for changes in the device status with an interval of 500 miliseconds 
  useEffect(() => {
    if (token) {
      setTimeout( async() => {
        const newDeviceStatus = await getStatus(token, deviceStatus);
        setDeviceStatus(newDeviceStatus);
       }, 500); 
   }
  }, [deviceStatus, token]);


  // if device mode is enabled, retrieve QRdata if available
  useEffect(() => {
    if (token) {
      setTimeout( async() => {
      if (init && deviceMode === DeviceMode.DEVICE_ENABLED) {
        const qrData = await getScannedData(token);
        if (qrData && qrData.status === 200 ) {
          if (scannedData === qrData.data.scannedData) {
          setScannedData('This QR code has already been scanned, please try another one.')
          } else { 
          setScannedData(qrData.data.scannedData);  
          }
          
          } 
          // disable device after a 200 repsose
          const disableResponse = await changeDeviceMode(token, 'disabled');
          if (disableResponse === 200) {
            setDeviceMode(DeviceMode.DEVICE_DISABLED);
        } else {
          setScannedData('');  
          return null
        }
      }
     
      }, 1000); 
    }
  }, [deviceMode, init, scannedData, token])


  return (
    <DemoAppContainer>
      <TurnOnDevice init={init} logInButtonHandler={logInButtonHandler} standByText={standByText} />
      <Header>Demo App</Header>
      <Content>
      <GetDeviceStatusText>{'QR-Scanner\nis ' + deviceStatus}</GetDeviceStatusText>
        <Wrap $isActive={init} $isEnabled={deviceMode === DeviceMode.DEVICE_ENABLED}>
       
          <button type="button" disabled={!init} onClick={enableDeviceButtonHandler}>
            <CrossHairIcon /><BlinkingDot $isActive={deviceMode === DeviceMode.DEVICE_ENABLED} /></button>

          {(init && deviceStatus === 'connected') &&
            <span>
              {deviceMode !== DeviceMode.DEVICE_ENABLED ? 'ACTIVATE' : 'DEACTIVATE'}<br />scan device</span>
          }

    
        </Wrap>

        
      </Content>

      <QrData>
          <QrDataHeader>Scanned data: </QrDataHeader>
          <QrDataContent>
          {scannedData}
          </QrDataContent>
          </QrData>
    </DemoAppContainer>
  )
}

export default DemoApp
