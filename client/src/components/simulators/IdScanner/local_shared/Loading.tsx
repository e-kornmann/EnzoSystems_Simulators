import styled, { keyframes } from 'styled-components';

const scaleUp = keyframes`
  0% { 
    transform: translate(-50%, -50%) scale(0) 
  }
  60% , 100% { 
    transform: translate(-50%, -50%) scale(1)}
`;

const breath = keyframes`
  0% , 100% { 
    transform: translate(-50%, -50%) scale(0.85) 
  }
  50% { 
    transform: translate(-50%, -50%) scale(1)}
`;

const pulse = keyframes`
  0% , 70% , 100% { 
    transform: scale(1) 
  }
  30% { 
    transform: scale(1.2)
  }
`;

const heartbeat = keyframes`
  0% , 100% { 
    transform: scale(0.85) 
  }
  50% { 
    transform: scale(1.15)
  }
`;

const SharedLoading = styled.div<{ $isHidden?: boolean, $isConnected?: boolean }>`
  width: 25px;
  height: 25px;
  border: 2px solid  ${props => (props.$isConnected ? 'transparent' : '#FFF')};
  border-radius: 50%;
  display: ${props => (props.$isHidden ? 'none' : 'inline-block')};
  box-sizing: border-box;
  position: relative;
  animation: ${props => (props.$isConnected ? heartbeat : pulse)} ${props => (props.$isConnected ? '3s' : '1s')} ease-in-out infinite;
  &::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 25px;
  border: 4px solid ${props => (props.$isConnected ? props.theme.colors.buttons.special : props.theme.colors.buttons.special)};
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: ${props => (props.$isConnected ? breath : scaleUp)} ${props => (props.$isConnected ? '3s' : '1s')} linear infinite;
  }`;

export default SharedLoading;
