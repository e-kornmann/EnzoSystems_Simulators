import { memo, useContext, useEffect } from 'react';
// styled components
import { styled } from 'styled-components';
// contexts
import { AppContext } from '../../utils/settingsReducer';
// shared components
import { SharedLoading } from '../../../local_shared/Loading';
import { SharedSuccesOrFailIcon } from '../../../local_shared/CheckAndCrossIcon';
// components
import { ChoosePayMethod } from './ChoosePayMethod/ChoosePayMethod';
import PinDigits from './PinDigits/PinDigits';
// translations
import ts from '../../Translations/translations';
// types
import ShowIcon from '../../../local_types/ShowIcon';
// enums
import OPSTATE from '../../enums/OperationalState';
import PayMethod from '../../enums/PayMethod';

type ShowProp = {
  $show: boolean;
};

type BottomButtonProps = {
  $showBottomButtons: boolean;
  $hideButtons?: boolean;
};

const ActiveTransactionContainer = styled('div')({
  display: 'grid',
  gridTemplateRows: '35% 15% 50%',
  width: '95%',
  maxWidth: '400px',
  margin: 'auto',
  height: '100%',
  paddingBottom: '3%',
});

const AmountBox = styled('div')<ShowProp>(({ $show }) => ({
  display: $show ? 'grid' : 'none',
  gridTemplateRows: '30% 10% 30% 30%',
  flexDirection: 'column',
  height: '100%',
}));

const IconContainer = styled('div')({
  gridRow: '1',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingTop: '5px',
});
const AmountText = styled('div')({
  gridRow: '2',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: '\'Inter\', sans-serif',
  fontSize: '0.9em',
  fontWeight: '500',
  textAlign: 'center',
  whiteSpace: 'pre-line',
});

const Price = styled('div')(({ theme }) => ({
  gridRow: '3',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontFamily: '\'Inter\', sans-serif',
  fontWeight: '600',
  fontSize: '1.5em',
  color: theme.colors.text.secondary,
}));

const Instruction = styled(AmountText)({
  display: 'block',
  gridRow: '4',
  fontSize: '1.0em',
  lineHeight: '1.15em',
});

const PincodeContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: '10%',
});

const Pads = styled('button')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontWeight: '600',
  borderRadius: '50px',
  cursor: 'pointer',
  height: '100%',
  color: theme.colors.text.black,
}));

const LoadingDotsContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gridRow: '3',
});

const StyledContent = styled('div')({
  display: 'grid',
  gridTemplateRows: '4fr 1fr',
  rowGap: '5%',
  height: '100%',
});

const StyledNumpad = styled.div<ShowProp>(({ $show }) => ({
  display: $show ? 'grid' : 'none',
  gridTemplateColumns: '1fr 1fr 1fr',
  gridTemplateRows: '1fr 1fr 1fr 1fr',
  maxHeight: '340px',
  maxWidth: '700px',
  height: '100%',
  columnGap: '5%',
  rowGap: '5%',
}));

const NumPadButton = styled(Pads)(({ theme }) => ({
  background: theme.colors.buttons.special,
  '&:active': {
    backgroundColor: theme.colors.buttons.specialDark,
    border: 'none',
  },
  '&:last-child': {
    gridColumn: '2',
  },
}));

// const ZeroButton = styled(NumPadButton)({
//   gridColumn: '2',
// });

const StyledFooter = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  height: '96%',
  maxHeight: '78px',
  columnGap: '5%',
});

const StopButton = styled(Pads)<BottomButtonProps>(({ theme, $showBottomButtons }) => ({
  display: $showBottomButtons ? 'flex' : 'none',
  height: '90%',
  marginTop: '10%',
  background: theme.colors.buttons.red,
  '&:active': {
    backgroundColor: theme.colors.buttons.darkred,
    border: 'none',
  },
}));

const CorrectButton = styled(Pads)<BottomButtonProps>(({ theme, $showBottomButtons, $hideButtons }) => ({
  display: $showBottomButtons && !$hideButtons ? 'flex' : 'none',
  height: '90%',
  marginTop: '10%',
  background: theme.colors.buttons.yellow,
  '&:active': {
    backgroundColor: theme.colors.buttons.darkyellow,
    border: 'none',
  },
}));

const OkButton = styled(Pads)<BottomButtonProps>(({ theme, $showBottomButtons, $hideButtons }) => ({
  display: $showBottomButtons && !$hideButtons ? 'flex' : 'none',
  height: '90%',
  marginTop: '10%',
  background: theme.colors.buttons.green,
  '&:active': {
    backgroundColor: theme.colors.buttons.darkgreen,
    border: 'none',
  },
}));

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

const ActiveTransactionComponent = ({
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

  const numpadArray = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

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
                {/* <ZeroButton key={'0'} onClick={() => handlePincodeSetter('0')} >{'0'}</ZeroButton> */}
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

export const ActiveTransaction = memo(ActiveTransactionComponent);
