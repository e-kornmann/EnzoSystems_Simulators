import PinComponent from '../PinEntry';
import { Status } from '../types/types';
import { ButtonContainer, CorrectButton, NrButton, OkButton, StopButton } from './style';


type Props = {
    showBottomButtons: boolean;
    stopHandler: () => void;
    payHandler: () => void;
    pinDigits: string[];
    handleButtonClick: (value: string) => void;
    currentState: Status;
}

const Buttons = ({ showBottomButtons, stopHandler, payHandler, handleButtonClick, pinDigits, currentState }: Props) => {

  const showNumPad: boolean = 
    currentState === Status.PIN_ENTRY ||
    currentState === Status.WRONG_PIN ||
    currentState === Status.WAITING ||
    currentState === Status.CHECK_PIN;

  const hideCorrectAndOkButton: boolean = 
    currentState === Status.CHOOSE_METHOD || 
    currentState === Status.ACTIVE_METHOD;

const numpadArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <ButtonContainer>
      <PinComponent pinDigits={pinDigits} $showPinEntry={showNumPad}/>
        {numpadArray.map((num) => {
       
      return (
        <NrButton
          key={num}
          $gridarea={num}
          $showNrs={showNumPad}
          onClick={() => handleButtonClick(num)}
        >
          {num}
        </NrButton>
      );
    })}

    <StopButton
      onClick={stopHandler}
      $showBottomButtons={showBottomButtons}
    >
      Stop
    </StopButton>
    <CorrectButton $showBottomButtons={showBottomButtons} $hideButtons={hideCorrectAndOkButton} onClick={() => handleButtonClick('correct-button')}>
      Correct
    </CorrectButton>
    <OkButton $showBottomButtons={showBottomButtons} $hideButtons={hideCorrectAndOkButton} onClick={payHandler}>
      OK
    </OkButton>
  </ButtonContainer>
  )
}

export default Buttons;
