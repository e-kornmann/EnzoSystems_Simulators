import styled from 'styled-components';
import * as Sv from '../../../../styles/stylevariables';

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 65px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 80px 1fr 1fr 1fr 1fr 1fr;
  gap: 12px 25px;
  grid-template-areas:
    'pin pin pin'
    'one two three'
    'four five six'
    'seven eight nine'
    'bl1 zero bl2'
    'stop correct ok';
  width: 360px;
  height: 420px;
  padding: 20px;
`;

const Pads = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${Sv.black};
  border-radius: 150px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    border: 5px solid #17121232;
  }
`;

type PadProps = {
  $showNrs: boolean;
  $gridarea: string;
};

const NrButton = styled(Pads)<PadProps>`
  display: ${(props) => (props.$showNrs ? 'flex' : 'none')};
  grid-area: ${(props) => props.$gridarea};
  background: ${Sv.enzoOrange};
  font-size: 25px;
  &:active {
    background-color: ${Sv.enzoDarkOrange};
    border: none;
  }
`;

type Props = {
  $showBottomButtons: boolean;
  $hideButtons?: boolean;
};

const StopButton = styled(Pads)<Props>`
  display: ${(props) => (props.$showBottomButtons ? 'flex' : 'none')};
  grid-area: stop;
  background: ${Sv.red};
  &:active {
    background-color: ${Sv.darkred};
    border: none;
  }
`;

const OkButton = styled(Pads)<Props>`
  display: ${(props) => (props.$showBottomButtons && !props.$hideButtons ? 'flex' : 'none')};
  grid-area: ok;
  background: ${Sv.green};
  &:active {
    background-color: ${Sv.darkgreen};
    border: none;
  }
`;

const CorrectButton = styled(Pads)<Props>`
  display: ${(props) => (props.$showBottomButtons && !props.$hideButtons ? 'flex' : 'none')};
  grid-area: correct;
  background: ${Sv.yellow};
  &:active {
    background-color: ${Sv.darkyellow};
    border: none;
  }
`;

export { ButtonContainer, StopButton, OkButton, CorrectButton, NrButton };
