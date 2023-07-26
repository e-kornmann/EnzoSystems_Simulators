
// import { ReactComponent as SuccessIcon } from '../../../../assets/svgs/success.svg';
import styled from "styled-components";
import * as Sv from "../../../../styles/stylevariables";
import { PayMethod, Status } from "..";
import { ReactComponent as PhoneIcon } from '../../../../assets/svgs/phone.svg';
import { ReactComponent as ChipIcon } from '../../../../assets/svgs/chip.svg';
import { ReactComponent as ContactlessIcon } from '../../../../assets/svgs/contactless.svg';


const IconContainer = styled.div`
  position: relative;
  top: 3px;
  margin: 0 15px 0 0; 
 `;

const Wrapper = styled.div`
  position: absolute;
  bottom: 180px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-bottom: 30px;
  height: 280px;
  `;

const PaymentMethodButton = styled.button`
  display: flex;
  justify-content: center;
  align-itemts: center;
  margin: 8px auto;
  color: white;
  width: 83%;
  padding: 15px 0;
  font-weight: 300;
  font-size: 0.8em;
  border-radius: 4px;
  cursor: pointer;
  z-index: 300;
  &:active {
    background-color: ${Sv.enzoDarkOrange};
  }
  `;

const SmartphoneButton = styled(PaymentMethodButton)<{ $inActive: boolean }>`
  background-color: ${(props) => (props.$inActive ? "#B4B4B4" : Sv.enzoOrange)};
`;

const ContactlessButton = styled(PaymentMethodButton)<{ $inActive: boolean }>`
  background-color: ${(props) => (props.$inActive ? "#B4B4B4" : Sv.enzoOrange)};
`;

const WithCardButton = styled(PaymentMethodButton)<{ $inActive: boolean }>`
  background-color: ${(props) => (props.$inActive ? "#B4B4B4" : Sv.enzoOrange)};
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
      <>
      <Wrapper>
        <SmartphoneButton onClick={() => chooseMethodHandler(PayMethod.SMARTPHONE)} $inActive={isInactiveButton(PayMethod.SMARTPHONE)}>
          <IconContainer>
            <PhoneIcon />
          </IconContainer>
          Smartphone
        </SmartphoneButton>
        <ContactlessButton onClick={() => chooseMethodHandler(PayMethod.CONTACTLESS)} $inActive={isInactiveButton(PayMethod.CONTACTLESS)}>
        <IconContainer>
          <ContactlessIcon />
        </IconContainer>
          Contactless card
        </ContactlessButton>
        <WithCardButton onClick={() => chooseMethodHandler(PayMethod.CARD)} $inActive={isInactiveButton(PayMethod.CARD)}>
        <IconContainer>
          <ChipIcon width={25} height={20} />
          </IconContainer>
          Insert card</WithCardButton>

      </Wrapper>
      </>
    )
  }
  
  export default ChoosePayMethod;