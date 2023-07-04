import styled from 'styled-components';
import * as S from '../../shared/buttons';

const Container = styled.main`
  display: grid;
  max-width: 600px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 50px 1fr 50px;
  margin: auto;
  height: 600px;
`;

const Header = styled.div`
  grid-column: 1 / 3;
  font-size: 30px;
  height: 60px;
`;

const TextBox = styled.div`
  grid-column: 1 / 3;
  height: 60px;
`

const OtherDevice = () => {
 
    return (
      <>
    <Container>
      <Header>
        Other Device
        </Header>
      <TextBox>This is a other device</TextBox>
      <S.ButtonRed style={{gridColumn: '1 / 2'}}>STOP</S.ButtonRed>
      <S.ButtonGreen style={{gridColumn: '3 / 4'}}>PAY</S.ButtonGreen>
      </Container>
      </>

  )
}

export default OtherDevice;