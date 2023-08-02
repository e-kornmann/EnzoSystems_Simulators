import { MessageContainer, Mainline, Subline } from "./Message";


type Props =  {
  statusCode: number | undefined
}
  
const ServerError = ({statusCode}: Props) => {

  let subline;
  let mainline;

  switch (statusCode) {
    case 409:
      mainline = "Conflict"
      subline = "Another payment was already in progres"
      break;
    default :
      mainline = "OUT OF ORDER"
      subline = "Unable to make payment"
  }

  return (
    <MessageContainer>
      <Mainline>{mainline}</Mainline>
      <Subline>{subline}</Subline>
    </MessageContainer>
  )
}

export default ServerError