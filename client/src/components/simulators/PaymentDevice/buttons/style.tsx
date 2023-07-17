import styled from 'styled-components';
import * as Sv from '../../../shared/stylevariables';

const ButtonContainer = styled.div`
  position: absolute;
  bottom: 65px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 80px 1fr 1fr 1fr 1fr 1fr;
  gap: 12px 20px;
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
  &:active {
    border: 5px solid #17121232;
  }
`;

type PadProps = {
  $showPinEntry: boolean;
  $gridarea: string;
};

const NrButton = styled(Pads)<PadProps>`
  display: ${(props) => (props.$showPinEntry ? 'flex' : 'none')};
  grid-area: ${(props) => props.$gridarea};
  background: ${Sv.enzoOrange};
  font-size: 25px;
`;

type Props = {
  $showBottomButtons: boolean;
};

const StopButton = styled(Pads)<Props>`
  display: ${(props) => (props.$showBottomButtons ? 'flex' : 'none')};
  grid-area: stop;
  background: ${Sv.red};
`;

const OkButton = styled(Pads)<Props>`
  display: ${(props) => (props.$showBottomButtons ? 'flex' : 'none')};
  grid-area: ok;
  background: ${Sv.green};
`;

const CorrectButton = styled(Pads)<Props>`
  display: ${(props) => (props.$showBottomButtons ? 'flex' : 'none')};
  grid-area: correct;
  background: ${Sv.yellow};
`;




export { ButtonContainer, StopButton, OkButton, CorrectButton, NrButton };
