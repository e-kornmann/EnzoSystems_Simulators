
// import { ReactComponent as SuccessIcon } from '../../../../assets/svgs/success.svg';
import styled from "styled-components";
import { enzoOrange } from "../../../shared/stylevariables";
import { PayMethod } from "..";


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
  margin: 8px auto;
  color: white;
  width: 83%;
  padding: 15px 0;
  font-weight: 300;
  font-size: 0.8em;
  border-radius: 4px;
  z-index: 3000;
  &:active {
    background-color: #CE6100;
  }
  `;

const SmartphoneButton = styled(PaymentMethodButton)<{ $inActive: boolean }>`
  background-color: ${(props) => (props.$inActive ? "gray" : enzoOrange)};
`;

const ContactlessButton = styled(PaymentMethodButton)<{ $inActive: boolean }>`
  background-color: ${(props) => (props.$inActive ? "gray" : enzoOrange)};
`;


const WithCardButton = styled(PaymentMethodButton)<{ $inActive: boolean }>`
  background-color: ${(props) => (props.$inActive ? "gray" : enzoOrange)};
`;

  type Props = {
    chooseMethodHandler: (method: PayMethod) => void;
    activePayMethod: PayMethod;
  }

const ChooseMethod = ({chooseMethodHandler, activePayMethod }: Props) => {

    const isInactiveButton = (thisPayMethod: PayMethod): boolean =>  thisPayMethod !== activePayMethod && thisPayMethod !== PayMethod.NONE


    return (
      <>
      <Wrapper>
        <SmartphoneButton onClick={() => chooseMethodHandler(PayMethod.SMARTPHONE)} $inActive={isInactiveButton(PayMethod.SMARTPHONE)}>Smartphone</SmartphoneButton>
        <ContactlessButton onClick={() => chooseMethodHandler(PayMethod.CONTACTLESS)} $inActive={isInactiveButton(PayMethod.CONTACTLESS)}>Contactless</ContactlessButton>
        <WithCardButton onClick={() => chooseMethodHandler(PayMethod.CARD)} $inActive={isInactiveButton(PayMethod.CARD)}>Card</WithCardButton>

      </Wrapper>
      </>
    )
  }
  
  export default ChooseMethod;