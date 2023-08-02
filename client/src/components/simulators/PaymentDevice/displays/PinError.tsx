
import FailureIcon from "../../../shared/svgcomponents/Fail";
import { MessageContainer, IconContainer, Subline } from "./Message";

type Props = {
  actionFailureType: string;
}

const PinError = ({actionFailureType}: Props) => {

  let failureMessage; 

  if (actionFailureType === 'FAIL') {
    failureMessage = `PIN Limit Exceeded.\nCard Usage Restricted.`;
  } else if (actionFailureType === 'DECLINE') {
    failureMessage = "Unable to Complete\nTransaction: Low Balance";
  } else {
    failureMessage = "Payment failed.";
  }

  return (

      <MessageContainer>
        <IconContainer><FailureIcon width={73} height={73}/></IconContainer>
        <Subline>{ failureMessage }</Subline>
      </MessageContainer>

  )};

  
  export default PinError;
  