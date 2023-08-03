import styled, { keyframes } from "styled-components";
import * as Sv from '../../../styles/stylevariables';
import { hostCredentials, reqBody } from './config';
import InputAmount from './input/InputAmount';
import { useState, useEffect, useCallback } from 'react';
import createTransaction from './utils/createTransaction';
import stopTransaction from './utils/stopTransactionHost';
import useLogOn from '../../../hooks/useLogOn';
import { options } from './settings/settings';
import useGetTransaction from '../../../hooks/useGetTransaction';
import { Container, Content, Header } from '../../shared/DraggableModal/ModalTemplate';
import TransactionDetails from "./TransactionDetails/TransactionDetails";
import { IntlConfigType } from "../../../types/IntlConfigType";

const DemoAppContainer = styled.div`
  display: grid;
  grid-template-rows: 40px 70px 38px 1fr 26px; 
  justify-content: center;
  align-items: center;
  line-height: 0.9em;
  margin: auto;
  width: 80%;
  height: 90%;
`
const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: flex-start;
  padding-top: 15px;
`
const OkButton = styled.button`
  cursor: pointer;
  color: ${Sv.black};
  width: 60px;
  height: 30px;
  font-size: 12px;
  font-weight: 600;
  min-width: 0;
  background-color: ${Sv.green}; 
  border-radius: 40px;
  padding: 3px;
  &:active {
    background-color: ${Sv.darkgreen};
  }
`
const StopButton = styled(OkButton)`
  background-color: ${Sv.red}; 
  &:active {
    background-color: ${Sv.darkred};
  }
`
const TransactionDetailsHeader = styled.div`
  color: white;
  width: 100%;
  height: 100%;
  padding: 4px 6px;
  font-size: 10px;
  background-color: ${Sv.asphalt}; 
  border-bottom: 1px solid #EBEBEB;
  border-radius: 3px 3px 0 0;
  
`
const TransactionDetailsContent = styled.div`
  color: white;
  width: 100%;
  height: 100%;
  padding: 4px 6px;
  font-size: 10px;
  background-color: ${Sv.asphalt}; 
`
const TransactionDetailsFooter = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  font-size: 10px;
  align-items: baseline;
  background-color: ${Sv.asphalt}; 
  border-top: 1px solid #EBEBEB;
  border-radius: 0 0 3px 3px;
`
const blinkAnimation = keyframes`
  70%, 100% {
    opacity: 1;
  }
  30% {
    opacity: 0;
  }
`
const StatusText = styled.div<{ $isActive: boolean }>`
  color: ${(props) => (props.$isActive ? Sv.green : Sv.red)};
`
const BlinkingDot = styled(StatusText) <{ $isActive: boolean }>`
  width: 6px;
  height: 6px;
  background-color: ${(props) => (props.$isActive ? Sv.green : Sv.red)};
  border-radius: 100px;
  margin: 10px 7px;
  animation-name: ${blinkAnimation};
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  }
`
const Footer = styled.footer<{ $init: boolean }>`
  position: absolute;
  font-size: 12px;
  color: ${(props) => (props.$init ? Sv.green : Sv.red)};
  width: 100%;
  bottom: 0px;
  display: flex;
  justify-content: center;
  padding: 15px 10px;
  background-color: white;
  border-radius: 0 0 5px 5px;
`

const DemoApp = () => {
  const [init, setInit] = useState(false);
  const { token, logOn } = useLogOn(hostCredentials, reqBody);
  const [isActive, setIsActive] = useState(false);
  const [transactionIdApp, setTransactionIdApp] = useState('');
  const { transactionDetails, getTransaction } = useGetTransaction(token, transactionIdApp);

  const [intlConfig, setIntlConfig] = useState<IntlConfigType>(options[0]);
  const [value, setValue] = useState<string | undefined>('123');

  const handleOnValueChange = (value: string | undefined): void => {
    setValue(value);
  };

  const handleIntlSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const config = options[Number(event.target.value)];
    if (config) {
      setIntlConfig(config);
    }
  };

  useEffect(() => {
    if (init === false) {
      const doLogOn = async () => {
        const logOnSucceeded = await logOn();
        setInit(logOnSucceeded);
      };
      setTimeout(() => doLogOn(), 5000);
    }
  }, [init, logOn]);

  useEffect(() => {
    if (transactionIdApp !== '' && token !== '') {
      const interval = setInterval(() => {
        getTransaction();
      }, 3000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [getTransaction, token, transactionIdApp]);

  const reset = useCallback(() => {
    setTransactionIdApp('');
    getTransaction();
  }, [getTransaction]);

  useEffect(() => {
    if (
      transactionIdApp !== '' &&
      (transactionDetails.status !== 'FAILED' &&
        transactionDetails.status !== 'STOPPED' &&
        transactionDetails.status !== 'TIMEDOUT' &&
        transactionDetails.status !== 'DECLINED' &&
        transactionDetails.status !== 'FINISHED')
    ) {
      setTimeout(() => setIsActive(true), 2000);
    } else {
      setTimeout(() => {
        reset();
        setIsActive(false);
      }, 2000);
    }
  }, [isActive, reset, transactionDetails, transactionIdApp]);

  return (
    <Container>
      <Header>Demo App</Header>
      <Content>
        <DemoAppContainer>

          <InputAmount value={value} handleOnValueChange={handleOnValueChange} intlConfig={intlConfig} handleIntlSelect={handleIntlSelect} />

          <ButtonContainer>
            {isActive ? <StopButton type="button" onClick={() => stopTransaction(token, transactionIdApp, setIsActive, reset)} >Stop</StopButton> :
              <OkButton type="button" onClick={() => createTransaction(token, value, setTransactionIdApp, intlConfig)} >OK</OkButton>}
          </ButtonContainer>

          <TransactionDetailsHeader>
            TransactionId:<br/> 
            {transactionIdApp}
            </TransactionDetailsHeader>

          <TransactionDetailsContent>
            
            {isActive ? ( <TransactionDetails transactionDetails={transactionDetails} />
            ): ''}

          </TransactionDetailsContent>
          <TransactionDetailsFooter>
            <BlinkingDot $isActive={isActive} /> <StatusText $isActive={isActive}>{transactionDetails.status}</StatusText>
          </TransactionDetailsFooter>
        </DemoAppContainer>

      </Content>
      <Footer $init={init}>{import.meta.env.VITE_HOST_ID} {init ? 'is logged in to the Enzo Pay API' : 'logging in'}</Footer>
    </Container>
  );
};

export default DemoApp;







