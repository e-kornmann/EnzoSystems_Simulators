
import styled from 'styled-components';
import SuccessIcon from './Success';


  const StyledSuccessIcon = styled(SuccessIcon)`
  width: 10px;
  height: 10px;
`;

export const CustomRadio = styled.input.attrs({ type: 'radio' })`
  -webkit-appearance: none;
  appearance: none;
  background-color: black;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid currentColor;
  border-radius: 50%;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
  
  &::before {
    content: '';
    width: 0.65em;
    height: 0.65em;
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    box-shadow: inset 1em 1em black;
    background-color: CanvasText; /* Windows High Contrast Mode */
  }
  
  &:checked::before {
    content: url("data:image/svg+xml,${encodeURIComponent(
        new XMLSerializer().serializeToString(<StyledSuccessIcon />)
      )}");
    transform: scale(1);
  }
  
  &:focus {
    outline: max(2px, 0.15em) solid currentColor;
    outline-offset: max(2px, 0.15em);
  }
`;