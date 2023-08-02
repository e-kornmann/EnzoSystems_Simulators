import React, { useRef } from "react";
import styled from "styled-components";
import * as Sv from "../../../../styles/stylevariables";

type DigitProps = {
  $showPinEntry: boolean;
};

<<<<<<< HEAD:client/src/components/simulators/PaymentDevice/PinEntry/PinDigits.tsx
 
=======
>>>>>>> 109a59d764cc376814feed24b47e1f735bb51ca3:client/src/components/simulators/PaymentDevice/ActiveTransaction/PinDigits.tsx
const Digit = styled.input<DigitProps>`
  display: ${(props) => (props.$showPinEntry ? 'block' : 'none')};
  border: none;
  background-color: transparent;
  color: ${Sv.asphalt};
  text-align: center;
  font-size: 1.2em;
  margin: 4px;
<<<<<<< HEAD:client/src/components/simulators/PaymentDevice/PinEntry/PinDigits.tsx
=======
  padding: 0;
>>>>>>> 109a59d764cc376814feed24b47e1f735bb51ca3:client/src/components/simulators/PaymentDevice/ActiveTransaction/PinDigits.tsx
  width: 20px;
  height: 20px;
  border-bottom: 2px solid ${Sv.asphalt};
`;

type Props = {
  pinDigits: string[];
  $showPinEntry: boolean;
}

const PinDigits = ({pinDigits, $showPinEntry}:Props) => {

  const secondDigitRef = useRef<HTMLInputElement>(null);
  const thirdDigitRef = useRef<HTMLInputElement>(null);
  const fourthDigitRef = useRef<HTMLInputElement>(null);
  const moveToNextField = (event: React.FormEvent<HTMLInputElement>, nextField: string) => {
  const inputLength = event.currentTarget.value.length;
 

    if (inputLength === 1) {
      switch (nextField) {
        case "seconddigit":
          secondDigitRef.current?.focus();
          break;
        case "thirddigit":
          thirdDigitRef.current?.focus();
          break;
        case "fourthdigit":
          fourthDigitRef.current?.focus();
          break;
        default:
          break;
      }
    }
  };

  return (
 <>
      {pinDigits.map((digit, index) => (
        <Digit
          $showPinEntry={$showPinEntry}
          key={index}
          type="text"
          value={digit.length > 0 ? "*".repeat(digit.length) : ""}
          onInput={(event: React.FormEvent<HTMLInputElement>) =>
            moveToNextField(event, index === 0 ? "seconddigit" : index === 1 ? "thirddigit" : "fourthdigit")
          }
          ref={index === 1 ? secondDigitRef : index === 2 ? thirdDigitRef : index === 3 ? fourthDigitRef : null}
        />
      ))}
</>
  );
};

export default PinDigits;