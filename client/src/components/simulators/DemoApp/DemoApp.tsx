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
import { Container, GenericFooter, Header } from '../../shared/DraggableModal/ModalTemplate';
import TransactionDetails from "./TransactionDetails/TransactionDetails";
import { IntlConfigType } from "../../../types/IntlConfigType";

const DemoAppContainer = styled.div`
  display: grid;
  grid-template-rows: 40px 70px 35px 1fr 26px; 
  margin: auto;
  width: 83%;
  height: 87%;
`
const Content = styled.div`
  padding: 0 4px 50px;
  display: flex;
  flex-direction: column;
  overflow-y: sunset;
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
  font-size: 1.0em;
  font-weight: 600;
  min-width: 0;
  background-color: ${Sv.green}; 
  border-radius: 40px;
  padding: 3px;
  &:active {
    background-color: ${Sv.darkgreen};
  }
  &:disabled {
    cursor: inherit;
    background-color: ${Sv.gray};
    color: gray;
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
  font-size: 0.82em;
  background-color: ${Sv.asphalt}; 
  border-bottom: 1px solid  ${Sv.appBackground};
  border-radius: 3px 3px 0 0;
  
`
const TransactionDetailsContent = styled.div`
  color: white;
  width: 100%;
  height: 100%;
  padding: 4px 6px;
  font-size: 0.82em;
  background-color: ${Sv.asphalt}; 
`
const TransactionDetailsFooter = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  font-size: 0.82em;
  align-items: baseline;
  background-color: ${Sv.asphalt}; 
  border-top: 1px solid ${Sv.appBackground};
  border-radius: 0 0 3px 3px;
`
const blinkAnimation = keyframes`
  90%, 100% {
    opacity: 1;
  }
  10% {
    opacity: 0;
  }
`
const StatusText = styled.div<{ $isActive: boolean }>`
  color: ${(props) => (props.$isActive ? Sv.green : Sv.red)};
`
const BlinkingDot = styled(StatusText)`
  width: 6px;
  height: 6px;
  background-color: ${(props) => (props.$isActive ? Sv.green : Sv.red)};
  border-radius: 100px;
  margin: 10px 7px;
  animation-name: ${blinkAnimation};
  animation-duration: 1.0s;
  animation-iteration-count: infinite;
  }
`
const Footer = styled(GenericFooter)<{ $init: boolean }>`
  color: ${(props) => (props.$init ? Sv.green : Sv.red)};
  position: absolute;
  justify-content: center;
  bottom: 0px;
`;



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
      setTimeout(() => doLogOn(), 3000);
    }
  }, [init, logOn]);


  
  // get transaction ID with the useGetTransaction hook
  const getTransactionId = useCallback(() => {
    setTransactionIdApp('');
    getTransaction();
  }, [getTransaction]);

  // update transactionDetails with transaction ID with the same hook
  useEffect(() => {
    if (transactionIdApp !== '' && token !== '') {
      const interval = setInterval(() => {
        getTransaction();
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [getTransaction, token, transactionIdApp]);


  // check if app is active
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
        getTransactionId();
        setIsActive(false);
      }, 2000);
    }
  }, [isActive, getTransactionId, transactionDetails, transactionIdApp]);

  return (
    <Container>
      <Header>Demo App</Header>
      <Content>
        <DemoAppContainer>

          <InputAmount value={value} handleOnValueChange={handleOnValueChange} intlConfig={intlConfig} handleIntlSelect={handleIntlSelect} />

          <ButtonContainer>
            {isActive ? <StopButton type="button" onClick={() => stopTransaction(token, transactionIdApp, setIsActive, getTransactionId)} >Stop</StopButton> :
              <OkButton type="button" onClick={() => createTransaction(token, value, setTransactionIdApp, intlConfig)} disabled={!init}>OK</OkButton>}
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







