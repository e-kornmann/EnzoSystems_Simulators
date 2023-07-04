import styled from 'styled-components';
import CurrentDate from '../../shared/CurrentDate';
import * as S from '../../shared/buttons';
import { PayState } from './types';
import { useState } from 'react';
import * as Sv from '../../shared/stylevariables';

const Container = styled.main`
  background-color: ${Sv.asphalt};
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 400;
  display: grid;
  width: 300px;
  grid-template-columns: 1fr 1fr 1fr;
  column-gap: 30px;
  grid-template-rows: 50px 300px 45px;
  margin: auto;
  height: 400px;
  padding: 40px 30px;
  border-radius: 10px;
`;

const Header = styled.div`
  grid-column: 1 / 4;
  font-size: 25px;
  background-color: #b6beb5;
  padding: 12px 15px;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;

const TextBox = styled.div`
  grid-column: 1 / 4;
  padding: 12px 15px;
  font-size: 17px;
  height: 60px;
  background-color: #b6beb5;
  border-top: 1px dotted #1e1d1e;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;

const PaymendDevice = () => {
  const [payState, setPayState] = useState<PayState>({
    idle: true,
    req: false,
    res: {
      terminalId: '',
      transactionId: '',
      amount: '',
    },
    pending: false,
    success: false,
    abort: false,
  });

  return (
    <>
      <S.Button
        onClick={() => setPayState({ ...payState, idle: !payState.idle })}
        style={{ position: 'absolute', left: '-130px', top: '-130px' }}
      >
        {payState.idle ? 'do payment request' : 'set to idle'}
      </S.Button>
      <Container>
        <Header>{payState.idle ? 'Welcome' : 'Amount to pay'}</Header>
        <TextBox>
          <CurrentDate />
        </TextBox>
        <S.ButtonRed style={{ gridColumn: '1 / 2' }}>STOP</S.ButtonRed>
        <S.ButtonGreen style={{ gridColumn: '3 / 4' }}>PAY</S.ButtonGreen>
      </Container>
    </>
  );
};

export default PaymendDevice;
