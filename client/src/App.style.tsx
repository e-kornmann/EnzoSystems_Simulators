import styled from "styled-components";
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
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    width: 350px;
    z-index: 500;
`

export const PayBillContainer = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    align-items: center;
    padding: 30px;
    width: 300px;
    border: 1px solid black;
`

export const InputAmount = styled.input`
    flex: 1;
    margin: 0;
    padding: 4px;
    font-size: 23px;
    border-radius: 3px;
    border: 1px solid black;
  `

  export const AmountText = styled.div`
    width: 100%;
    height: 300px;
    padding: 4px;
    font-size: 23px;
  `

 export const OkButton = styled(Button)`
    width: 100px;
    min-width: 0;
    background-color: ${Sv.green}; 
`;

export const StopButton = styled(OkButton)`
    background-color: ${Sv.red}; 
`;
