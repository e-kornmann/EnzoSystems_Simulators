import styled from 'styled-components';
import CurrentDate from '../../shared/CurrentDate';
import * as S from '../../shared/buttons';
import { PayState } from './types';

const Container = styled.main`
  display: grid;
  width: 80%;
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



const PaymendDevice = ({...payState}: PayState) => {
    const { idle } = payState;
    return (
      <>
    <Container>
      <Header>
        {idle ? 'Welcome' : 'Amount to pay'}
        </Header>
      <TextBox><CurrentDate /></TextBox>
      <S.ButtonRed style={{gridColumn: '1 / 2'}}>STOP</S.ButtonRed>
      <S.ButtonGreen style={{gridColumn: '3 / 4'}}>PAY</S.ButtonGreen>
      </Container>
      </>

  )
}

export default PaymendDevice;