import { useCallback, useEffect, useState } from 'react';
import * as Sv from '../../../../styles/stylevariables';
import { Header } from '../../../shared/DraggableModal/ModalTemplate'
import styled, { keyframes } from "styled-components";
import { ReactComponent as CrossHairIcon } from '../../../../assets/svgs/crosshair.svg'
import TurnOnDevice from '../../../shared/TurnOnDevice';
import useLogOn from '../../../../hooks/useLogOn';
import { hostCredentials, reqBody } from '../../DemoApp/config';
import { getStatus } from './utils/getStatus';
import { setDeviceMode } from './utils/setDeviceMode';
import { getScannedData } from './utils/getScannedData';

const DemoAppContainer = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  position: absolute;
  width: 100px;
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
  height: 270px;
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
    margin-top: 30px;
    align-items: center;
    white-space: pre-line; 
  `



export enum DemoAppStatus {
  HOST_LOGGED_OUT,
  HOST_LOGGED_IN,
  DEVICE_ENABLED,
  DEVICE_DISABLED,
}



const DemoApp = () => {
  const [hostStatus, setHostStatus] = useState(DemoAppStatus.HOST_LOGGED_OUT);
  const { token, logOn } = useLogOn(hostCredentials, reqBody, 'barcode-scanner');
  const [deviceStatus, setDeviceStatus] = useState('disconnected');
  const [standByText, setStandByText] = useState<string>('OFF')
  const [init, setInit] = useState(false);
  const [scannedData, setScannedData] = useState('');
  


  const logInButtonHandler = useCallback(async () => {
    if (!init) {
      await logOn()
        .then((success) => {
          if (success) {
            setStandByText(' • •');
            setTimeout(() => { setStandByText('ON') }, 500);
            setInit(true);
            setHostStatus(DemoAppStatus.HOST_LOGGED_IN)
          } else {
            setStandByText('ERROR');

            setTimeout(() => {
              setStandByText('OFF');
            }, 4000);
            setInit(false)
            setHostStatus(DemoAppStatus.HOST_LOGGED_OUT)
          }
        });
 
    }
  }, [init, logOn]);


  
  const enableDeviceButtonHandler = async () => {
    if (token) {
      if (hostStatus === DemoAppStatus.HOST_LOGGED_IN || hostStatus === DemoAppStatus.DEVICE_DISABLED) {
        const enableResponse = await setDeviceMode(token, 'enabled');
        if (enableResponse === 200) {
          setHostStatus(DemoAppStatus.DEVICE_ENABLED);
  
          // After a successful enable, automatically disable the devive after 12 seconds
          setTimeout(async () => {
            const disableResponse = await setDeviceMode(token, 'disabled');
            if (disableResponse === 200) {
              setHostStatus(DemoAppStatus.DEVICE_DISABLED);
            }
          }, 12000);
        } else {
          setHostStatus(DemoAppStatus.DEVICE_DISABLED);
        }
      } else if (hostStatus === DemoAppStatus.DEVICE_ENABLED) {
        const disableResponse = await setDeviceMode(token, 'disabled');
        if (disableResponse === 200) {
          setHostStatus(DemoAppStatus.DEVICE_DISABLED);
        } else {
          setHostStatus(DemoAppStatus.DEVICE_ENABLED);
        }
      }
    }
  };
  

    
  useEffect(() => {
    logInButtonHandler();
  }, [logInButtonHandler]);



  
  useEffect(() => {
    const intervalId = setInterval( async() => {
      const status = await getStatus(token, deviceStatus);
      setDeviceStatus(status);
    }, 500); 

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [deviceStatus, token]);



  useEffect(() => {
    const fetchData = async () => { // Define an async function here
      if (init && hostStatus === DemoAppStatus.DEVICE_ENABLED) {
        const qrData = await getScannedData(token);
        if (scannedData !== qrData) {
          setScannedData(qrData.scannedData);  
        } else { setScannedData(`This QR code is already scanned,
          please try another one.`)
        }
        
      }
    };
  
    fetchData();
  
  }, [hostStatus, init, scannedData, token])


  return (
    <DemoAppContainer>
      <TurnOnDevice init={init} logInButtonHandler={logInButtonHandler} standByText={standByText} />
      <Header>Demo App</Header>
      <Content>
        
        <Wrap $isActive={hostStatus === DemoAppStatus.HOST_LOGGED_IN} $isEnabled={hostStatus === DemoAppStatus.DEVICE_ENABLED}>
        <GetDeviceStatusText>{deviceStatus && 'QR-Scanner\nis ' + deviceStatus}</GetDeviceStatusText>
          <button type="button" disabled={hostStatus === DemoAppStatus.HOST_LOGGED_OUT } onClick={enableDeviceButtonHandler}>
            <CrossHairIcon /><BlinkingDot $isActive={hostStatus === DemoAppStatus.DEVICE_ENABLED} /></button>

          {(hostStatus !== DemoAppStatus.HOST_LOGGED_OUT && deviceStatus === 'connected') &&
            <span>
              {hostStatus !== DemoAppStatus.DEVICE_ENABLED ? 'ACTIVATE' : 'DEACTIVATE'}<br />scan device</span>
          }


          Scanneddata: {scannedData}
        </Wrap>

        
      </Content>


    </DemoAppContainer>
  )
}

export default DemoApp
