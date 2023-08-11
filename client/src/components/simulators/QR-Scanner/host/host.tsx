import { useCallback, useState } from 'react';
import * as Sv from '../../../../styles/stylevariables';
import { Header } from '../../../shared/DraggableModal/ModalTemplate'
import styled, { keyframes } from "styled-components";
import { ReactComponent as CrossHairIcon } from '../../../../assets/svgs/crosshair.svg'
import TurnOnDevice from '../../../shared/TurnOnDevice';
import useLogOn from '../../../../hooks/useLogOn';
import { hostCredentials, reqBody } from '../../DemoApp/config';

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
  padding: 35px 5px;
  height: 190px;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  overflow-y: sunset;
`

const Wrap = styled.div<{ $isActive: boolean, $isEnabled: boolean }>`
    display: flex;
    justify-content: center;
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
        margin-top: 20px;
        background-color: ${Sv.asphalt};
        border-radius: 5px;
        cursor: pointer;
        & > svg {
          height: 18px;
          width: 18px;
          fill: ${(props) => (props.$isEnabled ? 'limegreen' : Sv.gray )};
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


export enum DemoAppStatus {
  HOST_LOGGED_OUT,
  HOST_LOGGED_IN,
  API_ENABLED,
  API_DISABLED,
}



const DemoApp = () => {
  const [hostStatus, setHostStatus] = useState(DemoAppStatus.HOST_LOGGED_OUT);
  const { token, logOn } = useLogOn( hostCredentials, reqBody, 'barcode-scanner');
  const [standByText, setStandByText] = useState<string>('OFF')
  const [init, setInit] = useState(false);

  const logInButtonHandler = useCallback(async () => {
    if (!init) {
      try {
        await logOn()
          .then((success) => {
            if (success) {
              setStandByText(' • •');  
              setTimeout(() => {setStandByText('ON')}, 500);   
              setInit(true); 
              setHostStatus(DemoAppStatus.HOST_LOGGED_IN)
            } else {
              setStandByText('ERROR');  
              setTimeout(() => {
                  setStandByText('OFF');   
              }, 4000); 
              setInit(false);
              setHostStatus(DemoAppStatus.HOST_LOGGED_OUT)
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



  

  const standByButtonHandler = () => {
    if (hostStatus === DemoAppStatus.HOST_LOGGED_IN) {
      setHostStatus(DemoAppStatus.API_ENABLED);

    }
    if (hostStatus === DemoAppStatus.API_ENABLED) {
      setHostStatus(DemoAppStatus.API_DISABLED);
      
    }
    if (hostStatus === DemoAppStatus.API_DISABLED) {
      setHostStatus(DemoAppStatus.API_ENABLED);
    }
  }



  return (
    <DemoAppContainer>
      <TurnOnDevice init={init} logInButtonHandler={logInButtonHandler} standByText={standByText} />
      <Header>Demo App</Header>
      <Content>

        <Wrap $isActive={hostStatus === DemoAppStatus.HOST_LOGGED_IN} $isEnabled={hostStatus === DemoAppStatus.API_ENABLED}>
        <button type="button" disabled={hostStatus === DemoAppStatus.HOST_LOGGED_OUT} onClick={standByButtonHandler}>
        <CrossHairIcon /><BlinkingDot $isActive={hostStatus === DemoAppStatus.API_ENABLED} /></button>
        
        {hostStatus !== DemoAppStatus.HOST_LOGGED_OUT &&  
        <span>
          {hostStatus !== DemoAppStatus.API_ENABLED ? 'ACTIVATE' : 'DEACTIVATE'}<br />scan device</span>
          }
      </Wrap>
      </Content>
    </DemoAppContainer>
  )
}

export default DemoApp
