import { Status } from '..';
import PinComponent from '../PinEntry';
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


  const showNumPad = ():boolean => currentState === Status.PIN_ENTRY || currentState === Status.PIN_FAILURE || currentState === Status.WAITING || currentState === Status.CHECK_PIN ;
  const hideButton = ():boolean => currentState === Status.CHOOSE_METHOD || currentState === Status.ACTIVE_METHOD;

const numpadArray = [
    'one', 
    'two', 
    'three', 
    'four', 
    'five', 
    'six', 
    'seven', 
    'eight', 
    'nine', 
    'zero'];

  return (
    <ButtonContainer>
      <PinComponent pinDigits={pinDigits} $showPinEntry={showNumPad()}/>
        {numpadArray.map((num, index) => {
        const padNr = String(index + 1 === 10 ? 0 : index + 1)
      return (
        <NrButton
          key={num}
          $gridarea={num}
          $showNrs={showNumPad()}
          onClick={() => handleButtonClick(padNr)}
        >
          {padNr}
        </NrButton>
      );
    })}

    <StopButton
      onClick={stopHandler}
      $showBottomButtons={showBottomButtons}
    >
      Stop
    </StopButton>
    <CorrectButton $showBottomButtons={showBottomButtons}  $hideButtons={hideButton()} onClick={() => handleButtonClick('correct-button')}>
      Correct
    </CorrectButton>
    <OkButton $showBottomButtons={showBottomButtons} $hideButtons={hideButton()} onClick={payHandler}>
      OK
    </OkButton>
  </ButtonContainer>
  )
}

export default Buttons;
