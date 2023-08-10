import { useState } from 'react';
import * as Sv from '../../../styles/stylevariables';
import { Header } from '../../shared/DraggableModal/ModalTemplate'
import styled, { keyframes } from "styled-components";
import { ReactComponent as StandByIcon } from '../../../assets/svgs/standby.svg'

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
  top: 0px;
  left: 0px;
  width: 6px;
  height: 6px;
  background-color: ${(props) => (props.$isActive ? Sv.green : Sv.red)};
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
    & > button {
        height: 32px;
        width: 32px;

        margin-top: 20px;
        background-color: ${Sv.asphalt};
        border-radius: 5px;
        cursor: pointer;
        & > svg {
          position: relative;
          top: 2px;
          height: 18px;
          width: 18px;
          fill: ${(props) => (props.$isEnabled ? Sv.green : Sv.red )};
        }
    
        &:disabled { 
          cursor: inherit;
          background-color: ${Sv.gray};
          & > svg {
            fill: ${Sv.appBackground};
          }
        }
    }
   
    & > span {
        padding: 3px;
        font-size: 0.75em;
        font-weight: 800;
        text-align: center;
        color: ${Sv.asphalt};
    }`

const LogInButton = styled.button`
  cursor: pointer;
  color: ${Sv.asphalt};
  width: 60px;
  height: 30px;
  font-size: 1.0em;
  font-weight: 600;
  min-width: 0;
  background-color: transparent;
  border-radius: 40px;
  padding: 3px;

`
const LogOutButton = styled(LogInButton)`
  color: ${Sv.asphalt};
`
export enum DemoAppStatus {
  HOST_LOGGED_OUT,
  HOST_LOGGED_IN,
  API_ENABLED,
  API_DISABLED,
}

type Props = {
  hostIsEnabledListener: () => void;
}

const DemoApp = ({ hostIsEnabledListener }: Props) => {
  const [hostStatus, setHostStatus] = useState(DemoAppStatus.HOST_LOGGED_OUT);

  const LogInHandler = () => setHostStatus(DemoAppStatus.HOST_LOGGED_IN);
  const LogOutHandler = () => setHostStatus(DemoAppStatus.HOST_LOGGED_OUT);

  const standByButtonHandler = () => {
    if (hostStatus === DemoAppStatus.HOST_LOGGED_IN) {
      setHostStatus(DemoAppStatus.API_ENABLED);
      hostIsEnabledListener();
    }
    if (hostStatus === DemoAppStatus.API_ENABLED) {
      setHostStatus(DemoAppStatus.API_DISABLED);
      hostIsEnabledListener();
    }
    if (hostStatus === DemoAppStatus.API_DISABLED) {
      setHostStatus(DemoAppStatus.API_ENABLED);
      hostIsEnabledListener();
    }
  }



  return (
    <DemoAppContainer>
      <Header> <BlinkingDot $isActive={hostStatus !== DemoAppStatus.HOST_LOGGED_OUT} />Demo App</Header>
      <Content>
        {hostStatus === DemoAppStatus.HOST_LOGGED_OUT && <LogInButton type='button' onClick={LogInHandler}>Login</LogInButton>}
        {hostStatus !== DemoAppStatus.HOST_LOGGED_OUT && <LogOutButton type='button' onClick={LogOutHandler}>Logout</LogOutButton>}
        <Wrap $isActive={hostStatus === DemoAppStatus.HOST_LOGGED_IN} $isEnabled={hostStatus === DemoAppStatus.API_ENABLED}>
        <button type="button" disabled={hostStatus === DemoAppStatus.HOST_LOGGED_OUT} onClick={standByButtonHandler}><StandByIcon /></button>
        
        {hostStatus !== DemoAppStatus.HOST_LOGGED_OUT &&  
        <span>
          {hostStatus !== DemoAppStatus.API_ENABLED ? 'Turn ON' : 'Turn OFF'}<br />scan device</span>
          }
      </Wrap>
      </Content>
    </DemoAppContainer>
  )
}

export default DemoApp
