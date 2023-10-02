import { styled } from 'styled-components';
import { useContext, useEffect } from 'react';
import { AppContext } from '../utils/settingsReducer';
import { PayMethod, OPSTATE } from '../types';
import * as Sv from '../../../../styles/stylevariables';
import ChoosePayMethod from './ChoosePayMethod/ChoosePayMethod';
import { SharedLoading } from '../../../shared/Loading';
import PinDigits from './PinDigits/PinDigits';
import ts from '../Translations/translations';
import { SharedSuccesOrFailIcon } from '../../../shared/CheckAndCrossIcon';
import ShowIcon from '../../../../types/ShowIcon';

type ShowProp = {
  $show: boolean;
};

const ActiveTransactionContainer = styled.div` 
  display: grid;
  grid-template-rows: 35% 15% 50%;
  width: 95%;
  max-width: 400px;
  margin: auto;
  height: 100%;
  padding-bottom: 3%;
`;
const AmountBox = styled.div<ShowProp>`
  display: ${props => (props.$show ? 'grid' : 'none')};
  grid-template-rows: 30% 10% 30% 30%;
  flex-direction: column;
  height: 100%;
`;
const IconContainer = styled.div`
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 5px;
`;
const AmountText = styled.div`
  grid-row: 2;
  display: flex;
  justify-content: center;
  align-items: center;  
  font-family: 'Inter', sans-serif;
  font-size: 0.9em;
  font-weight: 500;
  text-align: center;
  white-space: pre-line;
`;
const Price = styled.div`
  grid-row: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.5em;
  color: ${Sv.enzoOrange};
`;
const Instruction = styled(AmountText)`
  display: block;
  grid-row: 4;
  font-size: 1.0em;
  line-height: 1.15em;
`;
const PincodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10%;
`;
const Pads = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${Sv.black};

  font-weight: 600;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  height: 100%;
`;
const LoadingDotsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-row: 3;
`;
const StyledContent = styled.div`
  display: grid;
  grid-template-rows: 4fr 1fr;
  row-gap: 5%;
  height: 100%;
`;
const StyledNumpad = styled.div<ShowProp>`
  display: ${props => (props.$show ? 'grid' : 'none')};
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  max-height: 340px;
  max-width: 700px;
  height: 100%;
  column-gap: 5%;
  row-gap: 5%;
`;
const NumPadButton = styled(Pads)`
  background: ${Sv.enzoOrange};  
  &:active {
    background-color: ${Sv.enzoDarkOrange};
    border: none;
  }
`;
const ZeroButton = styled(NumPadButton)`
  grid-column: 2;
`;
const StyledFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 96%;
  max-height: 78px;
  column-gap: 5%;
`;
type BottomButtonProps = {
  $showBottomButtons: boolean;
  $hideButtons?: boolean;
};

const StopButton = styled(Pads) <BottomButtonProps>`
  display: ${props => (props.$showBottomButtons ? 'flex' : 'none')};
  height: 90%;
  margin-top: 10%;
  background: ${Sv.red};
  &:active {
    background-color: ${Sv.darkred};
    border: none;
  }
`;
const CorrectButton = styled(Pads) <BottomButtonProps>`
  display: ${props => (props.$showBottomButtons && !props.$hideButtons ? 'flex' : 'none')};
  height: 90%;
  margin-top: 10%;
  background: ${Sv.yellow};
  &:active {
    background-color: ${Sv.darkyellow};
    border: none;
  }
`;
const OkButton = styled(Pads) <BottomButtonProps>`
  display: ${props => (props.$showBottomButtons && !props.$hideButtons ? 'flex' : 'none')};
  height: 90%;
  margin-top: 10%;
  background: ${Sv.green};
  &:active {
    background-color: ${Sv.darkgreen};
    border: none;
  }
`;
type Props = {
  chooseMethodHandler: (method: PayMethod) => void;
  activePayMethod: PayMethod;
  amount: number;
  handleStopEvent: () => void;
  handleConfirmEvent: () => void;
  pincode: string;
  handlePincodeSetter: (value: string) => void;
  handleCorrectionEvent: ()=>void;
  currentState: OPSTATE;
  init: boolean;
};

const ActiveTransaction = ({
  chooseMethodHandler,
  init,
  activePayMethod,
  handleStopEvent,
  handleConfirmEvent,
  handlePincodeSetter,
  handleCorrectionEvent,
  pincode,
  currentState,
  amount,
}: Props) => {
  const { state } = useContext(AppContext);
  const amountFormat = new Intl.NumberFormat(state.currency, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const amountText = `${state.currency} ${amountFormat.format(amount / 100)}`;

  let instruction: string;
  switch (currentState) {
    case OPSTATE.PIN_ENTRY:
      instruction = ts('enterPin', state.language);
      break;
    case OPSTATE.WRONG_PIN:
      instruction = ts('wrongPin', state.language);
      break;
    case OPSTATE.PIN_CONFIRM:
      instruction = ts('confirmPin', state.language);
      break;
    default:
      instruction = ts('presentCard', state.language);
      break;
  }

  const transactionIsActive: boolean = currentState === OPSTATE.CHOOSE_METHOD
    || currentState === OPSTATE.ACTIVE_METHOD
    || currentState === OPSTATE.PIN_CONFIRM
    || currentState === OPSTATE.PIN_ENTRY
    || currentState === OPSTATE.CHECK_PIN
    || currentState === OPSTATE.WRONG_PIN;

  const showPayMethodButtons: boolean = currentState === OPSTATE.CHOOSE_METHOD
    || currentState === OPSTATE.ACTIVE_METHOD;

  const showNumPad: boolean = currentState === OPSTATE.PIN_ENTRY
    || currentState === OPSTATE.WRONG_PIN
    || currentState === OPSTATE.PIN_CONFIRM
    || currentState === OPSTATE.CHECK_PIN;

  const hideCorrectAndOkButton: boolean = currentState === OPSTATE.CHOOSE_METHOD
    || currentState === OPSTATE.ACTIVE_METHOD;

  // This useEffect listens to KeyEvents and initiates the corrsponding functions.
  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      // Check if the pressed key is a numeric key (0-9)
      if (/^[0-9]$/.test(event.key) && showNumPad) {
        handlePincodeSetter(event.key);
      }
      if (event.key === 'Enter' && showNumPad) {
        handleConfirmEvent();
      }
      if (event.key === 'Escape' && showNumPad) {
        handleStopEvent();
      }
      if (((event.key === 'Backspace') && showNumPad) || ((event.key === 'Delete') && showNumPad)) {
        handleCorrectionEvent();
      }
    };
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      // cleanup this component
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleConfirmEvent, handleStopEvent, handleCorrectionEvent, init, showNumPad, handlePincodeSetter]);

  const numpadArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  return (
    <>
    <ActiveTransactionContainer>
      <AmountBox $show={transactionIsActive}>
      { currentState === OPSTATE.CHECK_PIN ? <LoadingDotsContainer><SharedLoading /></LoadingDotsContainer>
        : <>
        <IconContainer><SharedSuccesOrFailIcon
          checkOrCrossIcon={currentState === OPSTATE.WRONG_PIN ? ShowIcon.CROSS : undefined } width={15} height={15}/>
        </IconContainer>
        <AmountText>{ ts('amountToPay', state.language) }</AmountText>
        <Price>{amountText}</Price>
        <Instruction>
          {instruction}
        </Instruction>
        </>
      }
        </AmountBox>

        <PincodeContainer><PinDigits pincode={pincode} $showPinEntry={showNumPad} /></PincodeContainer>

        <StyledContent>
          { showPayMethodButtons
            ? (
              <ChoosePayMethod chooseMethodHandler={chooseMethodHandler} activePayMethod={activePayMethod} currentState={currentState} />
            ) : (
              <StyledNumpad $show={showNumPad}>
                { numpadArray.map(num => <NumPadButton key={num} onClick={() => handlePincodeSetter(num)}>{num}</NumPadButton>) }
                <ZeroButton key={'0'} onClick={() => handlePincodeSetter('0')} >{'0'}</ZeroButton>
              </StyledNumpad>
            )
          }

        <StyledFooter>
          <StopButton $showBottomButtons={transactionIsActive} onClick={handleStopEvent}>Stop</StopButton>
          <CorrectButton $showBottomButtons={transactionIsActive} $hideButtons={hideCorrectAndOkButton} onClick={handleCorrectionEvent}>
            Cor</CorrectButton>
          <OkButton $showBottomButtons={transactionIsActive} $hideButtons={hideCorrectAndOkButton} type="button" onClick={handleConfirmEvent}>
            OK</OkButton>
        </StyledFooter>
        </StyledContent>

      </ActiveTransactionContainer>
    </>
  );
};

export default ActiveTransaction;
