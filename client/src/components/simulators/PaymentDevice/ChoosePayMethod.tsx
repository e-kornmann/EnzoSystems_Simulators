
// import { ReactComponent as SuccessIcon } from '../../../../assets/svgs/success.svg';
import styled from "styled-components";
import * as Sv from "../../../styles/stylevariables";
import { ReactComponent as PhoneIcon } from '../../../assets/svgs/phone.svg';
import { ReactComponent as ChipIcon } from '../../../assets/svgs/chip.svg';
import { ReactComponent as ContactlessIcon } from '../../../assets/svgs/contactless.svg';
import { PayMethod, Status } from "./types/types";


const IconContainer = styled.div`
  position: relative;
  top: 3px;
  margin: 0 15px 0 0; 
 `;

const Wrapper = styled.div`
  height: 80%;
  `;

const PaymentMethodButton = styled.button<{ $inActive: boolean }>`
  background-color: ${(props) => (props.$inActive ? "#B4B4B4" : Sv.enzoOrange)};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
  color: white;
  height: 32%;
  font-weight: 300;
  font-size: 0.7em;
  border-radius: 2px;
  cursor: pointer;
  z-index: 300;
  border-radius: 6px;
  &:active {
    background-color: ${Sv.enzoDarkOrange};
  }
  `;

  type Props = {
    chooseMethodHandler: (method: PayMethod) => void;
    activePayMethod: PayMethod;
    currentState: Status;
  }

const ChoosePayMethod = ({chooseMethodHandler, activePayMethod, currentState }: Props) => {
    
    const isInactiveButton = (thisPayMethod: PayMethod): boolean =>
    currentState === Status.ACTIVE_METHOD && thisPayMethod !== activePayMethod;

    return ( 
      <Wrapper>
        <PaymentMethodButton onClick={() => chooseMethodHandler(PayMethod.SMARTPHONE)} $inActive={isInactiveButton(PayMethod.SMARTPHONE)}>
          <IconContainer>
            <PhoneIcon  width={15} height={15} />
          </IconContainer>
          Smartphone
        </PaymentMethodButton>
        <PaymentMethodButton onClick={() => chooseMethodHandler(PayMethod.CONTACTLESS)} $inActive={isInactiveButton(PayMethod.CONTACTLESS)}>
        <IconContainer>
          <ContactlessIcon width={15} height={15} />
        </IconContainer>
          Contactless card
        </PaymentMethodButton>
        <PaymentMethodButton onClick={() => chooseMethodHandler(PayMethod.CARD)} $inActive={isInactiveButton(PayMethod.CARD)}>
        <IconContainer>
          <ChipIcon width={13} height={13} />
          </IconContainer>
          Insert card
        </PaymentMethodButton>
      </Wrapper>
    )
  }
  
  export default ChoosePayMethod;