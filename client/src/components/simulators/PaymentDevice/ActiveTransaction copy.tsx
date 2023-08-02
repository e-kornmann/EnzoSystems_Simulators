import { styled } from 'styled-components';
import { useContext } from 'react';
import { AppContext } from './utils/settingsReducer';
import { PayMethod, Status } from './types/types';
import * as Sv from '../../../styles/stylevariables';
import FailureIcon from '../../shared/Fail';
import ChoosePayMethod from './ChoosePayMethod';
import { Loading } from '../../shared/Loading';
import PinDigits from './PinDigits';

type ShowProp = {
  $show: boolean;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 2fr 1fr 2fr 3fr 3fr 10fr 1fr 3fr;
  grid-template-areas:
  '. icon .'
  'amount amount amount'
  'price price price'
  'instruction instruction instruction'
  'pincode pincode pincode'
  'numpad numpad numpad'
  '. . .'
  'stopButton correctButton confirmButton';
`

const NumpadContainer = styled.div` 
  grid-area: numpad;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  border: 1px solid gray;
`


// const AmountBox = styled.div
//   flex-direction: column;
//   justify-content: center;
//   border: 1px solid gray;
//   height: 100%;
//   width: 100%;
//   `

const AmountText = styled.div<ShowProp>`
  grid-area: amount; 
  display: ${(props) => (props.$show ? 'flex' : 'none')};
  width: 100%;
  font-family: 'Inter', sans-serif;
  font-size: 0.65em;
  font-weight: 500;
  justify-content: center; 
  border: 1px solid gray;
`

const Instruction = styled(AmountText)`
  grid-area: instruction; 
  font-size: 0.75em;
`

const Price = styled.div<ShowProp>`
  grid-area: price; 
  display: ${(props) => (props.$show ? 'flex' : 'none')};
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.05em;
  color: ${Sv.enzoOrange};
  justify-content: center; 
  border: 1px solid gray;
`

const IconContainer = styled.div<ShowProp>`
  grid-area: icon;
  display: ${(props) => (props.$show ? 'flex' : 'none')};
  justify-content: center;
  border: 1px solid gray;
`


const PinCodeContainer = styled.div`
  grid-area: pincode; 
  display: flex;
  justify-content: center;
  align-items: flex-start;
  border: 1px solid gray;
  `;

const Pads = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${Sv.black};
  font-size: 0.7em;
  font-weight: 600;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
`;




type PadProps = {
  $showNrs: boolean;
};

const NumPadButton = styled(Pads) <PadProps>`
  display: ${(props) => (props.$showNrs ? 'flex' : 'none')};
  justify-content: center;
  align-items: center;
  background: ${Sv.enzoOrange};  
  &:active {
    background-color: ${Sv.enzoDarkOrange};
    border: none;
  }
`

const ZeroButton = styled(NumPadButton)`
  grid-area: 4/2;
`

type BottomButtonProps = {
  $showBottomButtons: boolean;
  $hideButtons?: boolean;
};

const StopButton = styled(Pads) <BottomButtonProps>`
    display: ${(props) => (props.$showBottomButtons ? 'flex' : 'none')};
    grid-area: stopButton;
    background: ${Sv.red};
    &:active {
      background-color: ${Sv.darkred};
      border: none;
    }
    border: 1px solid gray;
  `;

const CorrectButton = styled(Pads) <BottomButtonProps>`
    display: ${(props) => (props.$showBottomButtons && !props.$hideButtons ? 'flex' : 'none')};
    grid-area: correctButton;
    background: ${Sv.yellow};
    &:active {
      background-color: ${Sv.darkyellow};
      border: none;
    }
    border: 1px solid gray;
  `;

const OkButton = styled(Pads) <BottomButtonProps>`
    display: ${(props) => (props.$showBottomButtons && !props.$hideButtons ? 'flex' : 'none')};
    grid-area: confirmButton;
    background: ${Sv.green};
    &:active {
      background-color: ${Sv.darkgreen};
      border: none;
    }
    border: 1px solid gray;
  `;



type Props = {
  chooseMethodHandler: (method: PayMethod) => void;
  activePayMethod: PayMethod;
  amount: number;
  stopHandler: () => void;
  payHandler: () => void;
  pinDigits: string[];
  handleButtonClick: (value: string) => void;
  currentState: Status;
}

const ActiveTransaction = ({ chooseMethodHandler, activePayMethod, stopHandler, payHandler, handleButtonClick, pinDigits, currentState, amount }: Props) => {
  const { state } = useContext(AppContext);

  const amountFormat = new Intl.NumberFormat(state.currency, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const amountText = state.currency + ' ' + amountFormat.format(amount / 100);

  let subline: string;
  switch (currentState) {
    case Status.PIN_ENTRY:
      subline = 'Enter Pin';
      break;
    case Status.WRONG_PIN:
      subline = 'Wrong PIN. Try again.';
      break;
    default:
      subline = 'Present Card';
      break;
  }

  const transactionIsActive: boolean =
    currentState === Status.CHOOSE_METHOD ||
    currentState === Status.ACTIVE_METHOD ||
    currentState === Status.WAITING ||
    currentState === Status.PIN_ENTRY ||
    currentState === Status.CHECK_PIN ||
    currentState === Status.WRONG_PIN;

  const showPayMethodButtons: boolean =
    currentState === Status.CHOOSE_METHOD ||
    currentState === Status.ACTIVE_METHOD;

  const showNumPad: boolean =
    currentState === Status.PIN_ENTRY ||
    currentState === Status.WRONG_PIN ||
    currentState === Status.WAITING ||
    currentState === Status.CHECK_PIN;

  const hideCorrectAndOkButton: boolean =
    currentState === Status.CHOOSE_METHOD ||
    currentState === Status.ACTIVE_METHOD;

  const numpadArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <>
      
      
    <Grid>
      
      
        <>
        <IconContainer $show={true}>{ currentState === Status.WRONG_PIN ? <FailureIcon width={15} height={15} /> : ' '}</IconContainer>
        <AmountText $show={true}>{transactionIsActive ? 'Amount:' : ' '}</AmountText>
        <Price $show={true}>{ currentState === Status.CHECK_PIN ? <Loading /> :  (transactionIsActive ? amountText : ' ')}</Price>
        <Instruction $show={true}>{transactionIsActive ? subline : ' '}</Instruction>
      
        </>
      

      <PinCodeContainer>
        <PinDigits pinDigits={pinDigits} $showPinEntry={showNumPad && currentState !== Status.CHECK_PIN} />
      </PinCodeContainer>
    

      <NumpadContainer>
      {showPayMethodButtons ? <ChoosePayMethod
          chooseMethodHandler={chooseMethodHandler}
          activePayMethod={activePayMethod}
          currentState={currentState}
        /> : null}

        {numpadArray.map((num) => {
          return (
            <NumPadButton
              key={num}
              $showNrs={showNumPad && transactionIsActive}
              onClick={() => handleButtonClick(num)}
            >
              {num}
            </NumPadButton>
          );
        })}
        <ZeroButton key={'0'} $showNrs={showNumPad} onClick={() => handleButtonClick('0')} >
          {'0'}
        </ZeroButton>
        </NumpadContainer>
        
 

 
        <StopButton onClick={stopHandler} $showBottomButtons={transactionIsActive}>
          Stop
        </StopButton>
        <CorrectButton $showBottomButtons={transactionIsActive} $hideButtons={hideCorrectAndOkButton} onClick={() => handleButtonClick('correct-button')}>
          Cor
        </CorrectButton>
        <OkButton $showBottomButtons={transactionIsActive} $hideButtons={hideCorrectAndOkButton} onClick={payHandler}>
          OK
        </OkButton>
      </Grid>

    </>
  )
}

export default ActiveTransaction;