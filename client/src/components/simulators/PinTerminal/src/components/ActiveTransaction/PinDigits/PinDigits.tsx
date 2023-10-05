import styled from 'styled-components';

type DigitProps = {
  $showPinEntry: boolean;
};

const Digit = styled.div<DigitProps>(({ theme, $showPinEntry }) => ({
  display: $showPinEntry ? 'block' : 'none',
  border: 'none',
  backgroundColor: 'transparent',
  color: theme.colors.text.primary,
  textAlign: 'center',
  fontSize: '1.2em',
  margin: '4px',
  padding: 0,
  width: '20px',
  height: '20px',
  borderBottom: '2px solid',
  borderColor: theme.colors.text.primary,
}));

type Props = {
  pincode: string;
  $showPinEntry: boolean;
};

const PinDigits = ({ pincode, $showPinEntry }:Props) => (
 <>
   <Digit $showPinEntry={$showPinEntry}>{pincode.length >= 1 ? '*' : ''}</Digit>
   <Digit $showPinEntry={$showPinEntry}>{pincode.length >= 2 ? '*' : ''}</Digit>
   <Digit $showPinEntry={$showPinEntry}>{pincode.length >= 3 ? '*' : ''}</Digit>
   <Digit $showPinEntry={$showPinEntry}>{pincode.length >= 4 ? '*' : ''}</Digit>
  </>
);

export default PinDigits;
