import styled, { keyframes } from "styled-components";
import * as Sv from './stylevariables';

export const OpenModalButtonsContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  row-gap: 15px;
  column-gap: 5px;
  padding: 4px;
`;

export const OpenModelButton = styled.button<{$isActive: boolean}>`
appearance: none;
background-color: #FAFBFC;
border: 1px solid rgba(27, 31, 35, 0.15);
border-radius: 6px;
box-shadow: rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset;
box-sizing: border-box;
color: #24292E;
cursor: pointer;
display: inline-block;
font-size: 14px;
font-weight: 500;
line-height: 20px;
list-style: none;
padding: 6px 16px;
position: relative;
transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
user-select: none;
-webkit-user-select: none;
touch-action: manipulation;
vertical-align: middle;
white-space: nowrap;
word-wrap: break-word;
background-color: ${(props) => (props.$isActive ? `${Sv.lightgray}` : 'white')};
  &:active {
    background-color: darkgray;
    box-shadow: rgba(225, 228, 232, 0.2) 0 1px 0 inset;
    transition: none 0s;
  
    box-shadow: ${Sv.gray} 1px 1px 0 0;
    transform: translate(1px, 1px);
  }
  &:hover {
    background: gray;
    color: #fff;
  }
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
    text-align: center;
    width: 100%;
    height: 60px;
    padding: 4px;
    font-size: 11px;
  `


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



