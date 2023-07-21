import { Container, IconContainer, Subline } from "./styles"
import FailureIcon from "../../../shared/svgcomponents/Fail";





type Props = {
  currentPin: string;
  toggle: (waarde:string)=> void;
}


const correctPin = import.meta.env.VITE_PINCODE_SUCCEEDED;
const negBalancePin = import.meta.env.VITE_NEGBALANCE;


const PinError = ({currentPin, toggle}: Props) => {

  let failureMessage; 

  if (currentPin !== correctPin && currentPin !== negBalancePin) {
    failureMessage = `PIN Limit Exceeded.\nCard Usage Restricted.`;
    
    toggle('FAIL');
  } else if (currentPin === negBalancePin) {
    failureMessage = "Unable to Complete\nTransaction: Low Balance";
    toggle('DECLINE');
  } else {
    failureMessage = "Payment failed.";
  }

  return (

      <Container>
        <IconContainer><FailureIcon width={73} height={73}/></IconContainer>
        <Subline>{ failureMessage }</Subline>
      </Container>

  )};

  
  export default PinError;
  