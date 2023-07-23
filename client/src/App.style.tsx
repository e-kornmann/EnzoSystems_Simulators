import styled, { keyframes } from "styled-components";
import * as Sv from './components/shared/stylevariables';

export const Button = styled.button`
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.02em;
  font-weight: 600;
  font-size: 1.15em;
  background: transparant;
  border: 2px solid ${Sv.black};
  border-radius: 5px;
  min-width: 230px;
  max-width: 400px;
  padding: 10px 0px;
  cursor: pointer;
  transition: all 0, 1s ease-in;
  color: ${Sv.black};
  justify-self: flex-end;
  box-shadow: ${Sv.black} 3px 3px 0 0;

  &: active {
    box-shadow: ${Sv.black} 2px 2px 0 0;
    transform: translate(2px, 2px);
  }
  &: hover {
    background: gray;
    color: #fff;
  }
  &: hover > svg {
    fill: white;
  }
`;

export const ButtonModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 15px;
  padding: 40px;
`;

export const ConnectMessage = styled.header<{ $init: boolean }>`
  font-size: 14px;
  font-weight: 600;
  padding: 10px;
  background-color: ${(props) => (props.$init ? Sv.green : Sv.red)};
  color: white;
  text-align: center;
  z-index: 1000;
`
export const FocusContainer = styled.div`
    margin-top: 230px;
    width: 350px;
    z-index: 500;
`

export const PayBillContainer = styled.div`
    background-color: ${Sv.lightgray};
    border-radius: 10px;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
    padding: 30px;
    width: 300px;
`

export const InputAmount = styled.input`
    flex: 1;
    text-align: right;
    margin: 0;
    padding: 4px 14px;
    font-size: 23px;
    border-radius: 3px;
    border: 3px solid ${Sv.gray};
  `

  export const AmountText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: right;
    width: 100%;
    height: 60px;
    padding: 4px;
    font-size: 13px;
  `

 export const OkButton = styled(Button)`
    width: 100px;
    min-width: 0;
    background-color: ${Sv.green}; 
`;

export const StopButton = styled(OkButton)`
    background-color: ${Sv.red}; 
`;

export const StyledLable = styled.label`
    position: relative;
    top: 35px;
    left: 15px;
    font-weight: 500;
    font-size: 20px;
    color: ${Sv.black};
`

const blinkAnimation = keyframes`
  70%, 100% {
    opacity: 1;

  }
  30% {
    opacity: 0;
  }
`;

export const StatusText = styled.div`
  position: relative;
  top: 40px;
  right: 2px;
  font-size: 0.8em;
  float: right;
  width: 100px;
  height: 20px;
`

export const BlinkingDot = styled(StatusText)<{ $isActive: boolean }>`
  position: relative;
  top: 21px;
  right: 60px;
  width: 10px;
  height: 10px;
  background-color: ${(props) => (props.$isActive ? Sv.green : Sv.red)};
  border-radius: 100px;
  margin: 20px;
  animation-name: ${blinkAnimation};
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  }
`





