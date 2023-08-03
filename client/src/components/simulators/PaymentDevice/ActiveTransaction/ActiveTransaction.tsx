import { styled } from 'styled-components';
import { useContext } from 'react';
import { AppContext } from '../utils/settingsReducer';
import { PayMethod, Status } from '../types/types';
import * as Sv from '../../../../styles/stylevariables';
import ChoosePayMethod from './ChoosePayMethod/ChoosePayMethod';
import { LoadingDots } from '../../../shared/Loading';
import PinDigits from './PinDigits/PinDigits';
import CrossIcon from '../../../shared/Fail';
import ts from '../Translations/translations';

type ShowProp = {
  $show: boolean;
}

const ActiveTransactionContainer = styled.div` 
  display: grid;
  grid-template-rows: 35% 15% 40% 10%;
  width: 95%;
  max-width: 400px;
  margin: auto;
  height: 100%;
`
const AmountBox = styled.div<ShowProp>`
  display: ${(props) => (props.$show ? 'grid' : 'none')};
  grid-template-rows: 30% 10% 30% 30%;
  flex-direction: column;
  height: 100%;
`
const IconContainer = styled.div`
  grid-row: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 5px;
`
const AmountText = styled.div`
  grid-row: 2;
  display: flex;
  justify-content: center;
  align-items: center;  
  font-family: 'Inter', sans-serif;
  font-size: 0.65em;
  font-weight: 500;
  text-align: center;
  white-space: pre-line;
`
const Price = styled.div`
  grid-row: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.05em;
  color: ${Sv.enzoOrange};
`
const Instruction = styled(AmountText)`
  display: block;
  grid-row: 4;
  font-size: 0.7em;
  line-height: 1.15em;
`
const PincodeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10%;
`
const Pads = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${Sv.black};
  font-size: 0.68em;
  font-weight: 600;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  height: 100%;
`

const LoadingDotsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  grid-row: 3;
`

const StyledContent = styled.div`
  height: 100%;
`
const StyledNumpad = styled.div<ShowProp>`
  display: ${(props) => (props.$show ? 'grid' : 'none')};
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr 1fr;
  max-height: 340px;
  max-width: 700px;
  height: 100%;
  column-gap: 5%;
  row-gap: 5%;
`

const NumPadButton = styled(Pads)`
  background: ${Sv.enzoOrange};  
  &:active {
    background-color: ${Sv.enzoDarkOrange};
    border: none;
  }
`
const ZeroButton = styled(NumPadButton)`
  grid-column: 2;
`
const StyledFooter = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 100%;
  max-height: 78px;
  column-gap: 5%;
`
type BottomButtonProps = {
  $showBottomButtons: boolean;
  $hideButtons?: boolean;
}

const StopButton = styled(Pads) <BottomButtonProps>`
  display: ${(props) => (props.$showBottomButtons ? 'flex' : 'none')};
  height: 90%;
  margin-top: 10%;
  background: ${Sv.red};
  &:active {
    background-color: ${Sv.darkred};
    border: none;
  }
`
const CorrectButton = styled(Pads) <BottomButtonProps>`
  display: ${(props) => (props.$showBottomButtons && !props.$hideButtons ? 'flex' : 'none')};
  height: 90%;
  margin-top: 10%;
  background: ${Sv.yellow};
  &:active {
    background-color: ${Sv.darkyellow};
    border: none;
  }
`
const OkButton = styled(Pads) <BottomButtonProps>`
  display: ${(props) => (props.$showBottomButtons && !props.$hideButtons ? 'flex' : 'none')};
  height: 90%;
  margin-top: 10%;
  background: ${Sv.green};
  &:active {
    background-color: ${Sv.darkgreen};
    border: none;
  }
`

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
  console.log(amount);
  const amountFormat = new Intl.NumberFormat(state.currency, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const amountText = state.currency + ' ' + amountFormat.format(amount/100);

  let instruction: string;
  switch (currentState) {
    case Status.PIN_ENTRY:
      instruction = ts('enterPin', state.language);
      break;
    case Status.WRONG_PIN:
      instruction = ts('wrongPin', state.language);
      break;
    default:
      instruction = ts('presentCard', state.language);
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
    <ActiveTransactionContainer>
      <AmountBox $show={transactionIsActive}>
      { currentState === Status.CHECK_PIN ? <LoadingDotsContainer><LoadingDots>...</LoadingDots></LoadingDotsContainer> :  
        <>
        <IconContainer>{ currentState === Status.WRONG_PIN ? <CrossIcon width={15} height={15} fill={Sv.red} /> : ''}</IconContainer>
        <AmountText>{ ts('amountToPay', state.language) }</AmountText>
        <Price>{amountText}</Price>
        <Instruction>
          {instruction}
        </Instruction>
        </>
      }
      </AmountBox>

      <PincodeContainer><PinDigits pinDigits={pinDigits} $showPinEntry={showNumPad} /></PincodeContainer>
        <StyledContent>
          {showPayMethodButtons
            ?  <ChoosePayMethod
            chooseMethodHandler={chooseMethodHandler}
            activePayMethod={activePayMethod}
            currentState={currentState}
          /> 
            : <StyledNumpad $show={showNumPad}> {numpadArray.map((num) => {
              return (
                <NumPadButton
                  key={num}
                  onClick={() => handleButtonClick(num)}
                >
                  {num}
                </NumPadButton>
              );
            })}
            <ZeroButton key={'0'} onClick={() => handleButtonClick('0')} >
              {'0'}
            </ZeroButton></StyledNumpad>}
        </StyledContent>
        <StyledFooter>
        <StopButton onClick={stopHandler} $showBottomButtons={transactionIsActive}>
          Stop
        </StopButton>
        <CorrectButton $showBottomButtons={transactionIsActive} $hideButtons={hideCorrectAndOkButton} onClick={() => handleButtonClick('correct-button')}>
          Cor
        </CorrectButton>
        <OkButton $showBottomButtons={transactionIsActive} $hideButtons={hideCorrectAndOkButton} onClick={payHandler}>
          OK
        </OkButton>
        </StyledFooter>
      </ActiveTransactionContainer>
    </>
  )
}

export default ActiveTransaction;