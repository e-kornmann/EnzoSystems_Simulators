import styled from 'styled-components';
import * as Sv from '../stylevariables';

const Button = styled.button`
  font-family: 'Rubik', sans-serif;
  letter-spacing: 0.02em;
  font-weight: 600;
  font-size: 1.15em;
  background: transparant;
  border: 2px solid ${Sv.black};
  border-radius: 5px;
  width: 100%;
  padding: 10px 0px;
  cursor: pointer;
  transition: all 0, 1s ease-in;
  color: ${Sv.black};
  justify-self: flex-end;
  z-index: 3000;
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

const ButtonRed = styled(Button)`
  background: ${Sv.red};
  color: ${Sv.black};
`;

const ButtonGreen = styled(Button)`
  background: ${Sv.green};
  color: ${Sv.black};
`;

export { Button, ButtonRed, ButtonGreen};

