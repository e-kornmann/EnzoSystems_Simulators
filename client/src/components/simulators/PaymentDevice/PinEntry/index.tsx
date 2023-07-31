import React, { useRef } from "react";
import styled from "styled-components";
import * as Sv from "../../../../styles/stylevariables";

type DigitProps = {
  $showPinEntry: boolean;
};

const CodeContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  height: 25px;
  `;
  
const Digit = styled.input<DigitProps>`
  display: ${(props) => (props.$showPinEntry ? 'flex' : 'none')};
  border: none;
  background-color: transparent;
  color: ${Sv.asphalt};
  justify-content: center;
  font-size: 1.5em;
  margin: 0 4px;
  width: 20px;
  height: 100%;
  border-bottom: 2px solid ${Sv.asphalt};
`;

type Props = {
  pinDigits: string[];
  $showPinEntry: boolean;
}

const PinComponent = ({pinDigits, $showPinEntry}:Props) => {

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
    <CodeContainer>
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
    </CodeContainer>
  );
};

export default PinComponent;