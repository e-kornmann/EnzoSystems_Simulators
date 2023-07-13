import React, { useRef } from "react";
import styled from "styled-components";
import * as Sv from "../../../shared/stylevariables";

const CodeContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px;
  width: 100px;
  margin: auto;
`;

const Digit = styled.input`
  border: none;
  background-color: transparent;
  color: ${Sv.asphalt};
  text-align: center;
  padding: 5px;
  font-size: 38px;
  margin: 8px;
  width: 40px;
  height: 40px;
  border-bottom: 1px solid ${Sv.asphalt};
`;

type Props = {
  pinDigits: string[];
}

const PinComponent = ({pinDigits}:Props) => {

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
