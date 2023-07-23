import { Container, Mainline, Subline } from "./styles"

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
    <Container>
      <Mainline>{mainline}</Mainline>
      <Subline>{subline}</Subline>
    </Container>
  )
}

export default ServerError