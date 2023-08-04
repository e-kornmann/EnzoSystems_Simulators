import styled from "styled-components";
import * as Sv from "../../../../../styles/stylevariables";

type DigitProps = {
  $showPinEntry: boolean;
};

const Digit = styled.div<DigitProps>`
  display: ${(props) => (props.$showPinEntry ? 'block' : 'none')};
  border: none;
  background-color: transparent;
  color: ${Sv.asphalt};
  text-align: center;
  font-size: 1.2em;
  margin: 4px;
  padding: 0;
  width: 20px;
  height: 20px;
  border-bottom: 2px solid ${Sv.asphalt};
`;

type Props = {
  pincode: string;
  $showPinEntry: boolean;
}

const PinDigits = ({pincode, $showPinEntry}:Props) => {

  return (
 <>   
   <Digit $showPinEntry={$showPinEntry}>{pincode.length >= 1 ? "*" : ''}</Digit>
   <Digit $showPinEntry={$showPinEntry}>{pincode.length >= 2 ? "*" : ''}</Digit>
   <Digit $showPinEntry={$showPinEntry}>{pincode.length >= 3 ? "*" : ''}</Digit>
   <Digit $showPinEntry={$showPinEntry}>{pincode.length >= 4 ? "*" : ''}</Digit>
  </>
  );
};

export default PinDigits;