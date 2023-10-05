import { memo } from 'react';
// styled components
import styled from 'styled-components';
// svgs
import { ReactComponent as PhoneIcon } from '../../../../local_assets/phone.svg';
import { ReactComponent as ChipIcon } from '../../../../local_assets/chip.svg';
import { ReactComponent as ContactlessIcon } from '../../../../local_assets/contactless.svg';
// enums
import PayMethod from '../../../enums/PayMethod';
import OPSTATE from '../../../enums/OperationalState';

const Wrapper = styled.div`
  height: 80%;
  `;

const StyledPaymentMethodButton = styled('button')<{ $inActive: boolean }>(({ theme, $inActive }) => ({
  backgroundColor: $inActive ? theme.colors.buttons.gray : theme.colors.buttons.special,
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '4px',
  color: 'white',
  height: '32%',
  fontWeight: '300',
  fontSize: '0.9em',
  borderRadius: '2px 6px',
  cursor: 'pointer',
  zIndex: '300',
  '& > svg': {
    position: 'relative',
    top: '-1px',
    fill: 'white',
    marginRight: '6px',
  },
  '&:active': {
    backgroundColor: theme.colors.buttons.specialdark,
  },
}));

  type Props = {
    chooseMethodHandler: (method: PayMethod) => void;
    activePayMethod: PayMethod;
    currentState: OPSTATE;
  };

const ChoosePayMethodComponent = ({ chooseMethodHandler, activePayMethod, currentState }: Props) => {
  const isInactiveButton = (thisPayMethod: PayMethod): boolean => (
    currentState === OPSTATE.ACTIVE_METHOD && thisPayMethod !== activePayMethod
  );

  return (
      <Wrapper>
        <StyledPaymentMethodButton onClick={() => chooseMethodHandler(PayMethod.SMARTPHONE)} $inActive={isInactiveButton(PayMethod.SMARTPHONE)}>
          <PhoneIcon width={15} height={15} />Smartphone
        </StyledPaymentMethodButton>
        <StyledPaymentMethodButton onClick={() => chooseMethodHandler(PayMethod.CONTACTLESS)} $inActive={isInactiveButton(PayMethod.CONTACTLESS)}>
          <ContactlessIcon width={15} height={15} />Contactless card
        </StyledPaymentMethodButton>
        <StyledPaymentMethodButton onClick={() => chooseMethodHandler(PayMethod.CARD)} $inActive={isInactiveButton(PayMethod.CARD)}>
          <ChipIcon width={13} height={13} style={{ top: '0px' }} />Insert card
        </StyledPaymentMethodButton>
      </Wrapper>
  );
};

export const ChoosePayMethod = memo(ChoosePayMethodComponent);
