import PinComponent from '../PinEntry';
import { ButtonContainer, CorrectButton, NrButton, OkButton, StopButton } from './style';


type Props = {
    showPinEntry: boolean;
    showBottomButtons: boolean;
    stopHandler: () => void;
    payHandler: () => void;
    pinDigits: string[];
    handleButtonClick: (value: string) => void;
}

const Buttons = ({showPinEntry, showBottomButtons, stopHandler, payHandler, handleButtonClick, pinDigits }: Props) => {

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

     

        <PinComponent pinDigits={pinDigits} $showPinEntry={showPinEntry}/>
    {numpadArray.map((num, index) => {
      const padNr = String(index + 1 === 10 ? 0 : index + 1)
      
      return (
        <NrButton
          key={num}
          $gridarea={num}
          $showPinEntry={showPinEntry}
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
    <CorrectButton $showBottomButtons={showBottomButtons} onClick={() => handleButtonClick('correct-button')}>
      Correct
    </CorrectButton>
    <OkButton $showBottomButtons={showBottomButtons} onClick={payHandler}>
      OK
    </OkButton>
  </ButtonContainer>
  )
}

export default Buttons;
