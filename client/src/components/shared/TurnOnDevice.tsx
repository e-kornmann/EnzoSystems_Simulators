import styled from 'styled-components';
import * as Sv from '../../styles/stylevariables';

const Wrap = styled.div<{ $isLoggedIn: boolean }>`
  position: absolute;
  height: 10px;
  top: -23px;
  left: 2px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  & > span {
    font-size: 0.7em;
    font-weight: 800;
    color: #9f9f9f;
    margin-top: 2px;
  }

  & > button {
    width: 16px;
    height: 9px;
    padding: 2px;
    margin-right: 3px;
    display: flex;
    align-items: center;
    background-color: #9f9f9f;
    border-radius: 5px;
    cursor: pointer;
    justify-content: flex-start;

    & > div {
      position: absolute;
      left: ${props => (props.$isLoggedIn ? '9px' : '2px')};
      height: 5px;
      width: 5px;
      border-radius: 3px;
      background-color:  ${Sv.lightgray};
      transition: left 0.3s ease; /* Transition the left property */
    }

    &:disabled {
      cursor: inherit;
      background-color: ${Sv.gray};
      & > div {
        background-color: ${Sv.appBackground};
      }
    }
  }
`;

type Props = {
  init: boolean;
  logInButtonHandler: () => void;
  standByText? : string;
};

const TurnOnDevice = ({ init, logInButtonHandler, standByText }: Props) => (
    <Wrap $isLoggedIn={init}>
      <button type="button" onClick={logInButtonHandler}>
        <div></div>
      </button>
      <span>{standByText}</span>
    </Wrap>
);

export default TurnOnDevice;
