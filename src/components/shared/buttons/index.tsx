import styled from 'styled-components';
import * as Sv from './stylevariables';


const Button = styled.button`
  background: transparant;
  border: 1px solid black;
  width: 80px;
  padding: 5px 0px;
  cursor: pointer;
  transition: all 0, 1s ease-in;
  color: ${Sv.black}
  justify-self: flex-end;

  &: hover {
    background: gray;
    color: #fff;
  }
  &: hover > svg {
    fill: white;
  }
`;

const ButtonRed = styled(Button)`
  background: ${Sv.red}
`;

const ButtonGreen = styled(Button)`
  background: ${Sv.green}
`;

export { Button, ButtonRed, ButtonGreen};