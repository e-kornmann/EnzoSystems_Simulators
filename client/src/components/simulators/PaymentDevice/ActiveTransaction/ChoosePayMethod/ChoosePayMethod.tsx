
// import { ReactComponent as SuccessIcon } from '../../../../assets/svgs/success.svg';
import styled from "styled-components";
import * as Sv from "../../../../../styles/stylevariables";
import { ReactComponent as PhoneIcon } from '../../../../../assets/svgs/phone.svg';
import { ReactComponent as ChipIcon } from '../../../../../assets/svgs/chip.svg';
import { ReactComponent as ContactlessIcon } from '../../../../../assets/svgs/contactless.svg';
import { PayMethod, PinTerminalStatus } from "../../types";

const Wrapper = styled.div`
  height: 80%;
  `;

const PaymentMethodButton = styled.button<{ $inActive: boolean }>`
  background-color: ${(props) => (props.$inActive ? Sv.gray : Sv.enzoOrange)};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
  color: white;
  height: 32%;
  font-weight: 300;
  font-size: 0.9em;
  border-radius: 2px;
  cursor: pointer;
  z-index: 300;
  border-radius: 6px;
  & > svg {
    position: relative;
    top: -1px;
    fill: white;
    margin-right: 6px;
 }
  &:active {
    background-color: ${Sv.enzoDarkOrange};
  }
  `;

  type Props = {
    chooseMethodHandler: (method: PayMethod) => void;
    activePayMethod: PayMethod;
    currentState: PinTerminalStatus;
  }

const ChoosePayMethod = ({chooseMethodHandler, activePayMethod, currentState }: Props) => {
    
    const isInactiveButton = (thisPayMethod: PayMethod): boolean =>
    currentState === PinTerminalStatus.ACTIVE_METHOD && thisPayMethod !== activePayMethod;

    return ( 
      <Wrapper>
        <PaymentMethodButton onClick={() => chooseMethodHandler(PayMethod.SMARTPHONE)} $inActive={isInactiveButton(PayMethod.SMARTPHONE)}>
          <PhoneIcon  width={15} height={15} />Smartphone</PaymentMethodButton>
        <PaymentMethodButton onClick={() => chooseMethodHandler(PayMethod.CONTACTLESS)} $inActive={isInactiveButton(PayMethod.CONTACTLESS)}>
          <ContactlessIcon width={15} height={15} />Contactless card
        </PaymentMethodButton>
        <PaymentMethodButton onClick={() => chooseMethodHandler(PayMethod.CARD)} $inActive={isInactiveButton(PayMethod.CARD)}>
          <ChipIcon width={13} height={13} style={{top: '0px'}} />Insert card
        </PaymentMethodButton>
      </Wrapper>
    )
  }
  
  export default ChoosePayMethod;