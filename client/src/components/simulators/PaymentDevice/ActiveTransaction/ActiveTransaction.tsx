import { styled } from 'styled-components';
import { useContext } from 'react';
import { AppContext } from '../utils/settingsReducer';

import { PayMethod, Status } from '../types/types';
import * as Sv from '../../../../styles/stylevariables';
import FailureIcon from '../../../shared/svgcomponents/Fail';
import ChoosePayMethod from './ChoosePayMethod';
import { Loading } from '../displays/Loading';
import PinDigits from './PinDigits';

type ShowProp = {
  $show: boolean;
}

const AmountBox = styled.div<ShowProp>`
  display: ${(props) => (props.$show ? 'flex' : 'none')};
  height: 32%;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  padding-top: 10%;
  `

const AmountText = styled.div`
  width: 100%;
  font-family: 'Inter', sans-serif;
  font-size: 0.7em;
  font-weight: 500;
  text-align: center; 
  line-height: 0.3em;
  padding: 15px 0px;
  white-space: pre-line; 
`

const Message = styled(AmountText)`
  font-size: 0.85em;
`

const Price = styled.div`
  width: 100%;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 1.05em;
  line-height: 0.6em;
  color: ${Sv.enzoOrange};
  text-align: center; 
`
const IconContainer = styled.div<ShowProp>`
  display: ${(props) => (props.$show ? 'flex' : 'none')};
  width: 100%;
  justify-content: center;
`

const PincodeContainer = styled.div`
  display: flex;
  height: 20%;
  justify-content: center;
  align-items: center;
  `

const NumpadContainer = styled.div` 
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 16% 16% 16% 16% 16%;
  width: 95%;
  max-width: 400px;
  margin: auto;
  height: 48%;
  row-gap: 5%;
  column-gap: 8%;
`

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
    grid-area: 5/1;
    background: ${Sv.red};
    &:active {
      background-color: ${Sv.darkred};
      border: none;
    }
  `
const CorrectButton = styled(Pads) <BottomButtonProps>`
    display: ${(props) => (props.$showBottomButtons && !props.$hideButtons ? 'flex' : 'none')};
    grid-area: 5/2;
    background: ${Sv.yellow};
    &:active {
      background-color: ${Sv.darkyellow};
      border: none;
    }
  `;

const OkButton = styled(Pads) <BottomButtonProps>`
    display: ${(props) => (props.$showBottomButtons && !props.$hideButtons ? 'flex' : 'none')};
    grid-area: 5/3;
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

      <AmountBox $show={transactionIsActive}>
      { currentState === Status.CHECK_PIN ? <Loading /> :  
        <>
        <IconContainer $show={currentState === Status.WRONG_PIN}><FailureIcon width={15} height={15} /></IconContainer>
        <AmountText>Amount:</AmountText>
        <Price>{amountText}</Price>
        <Message>
          {subline}
        </Message>
        </>
      }
      </AmountBox>


      <PincodeContainer><PinDigits pinDigits={pinDigits} $showPinEntry={showNumPad} /></PincodeContainer>
     
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
              $showNrs={showNumPad}
              onClick={() => handleButtonClick(num)}
            >
              {num}
            </NumPadButton>
          );
        })}
        <ZeroButton key={'0'} $showNrs={showNumPad} onClick={() => handleButtonClick('0')} >
          {'0'}
        </ZeroButton>

        <StopButton onClick={stopHandler} $showBottomButtons={transactionIsActive}>
          Stop
        </StopButton>
        <CorrectButton $showBottomButtons={transactionIsActive} $hideButtons={hideCorrectAndOkButton} onClick={() => handleButtonClick('correct-button')}>
          Cor
        </CorrectButton>
        <OkButton $showBottomButtons={transactionIsActive} $hideButtons={hideCorrectAndOkButton} onClick={payHandler}>
          OK
        </OkButton>
      </NumpadContainer>

    </>
  )
}

export default ActiveTransaction;