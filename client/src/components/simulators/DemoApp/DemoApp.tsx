import styled, { keyframes } from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import * as Sv from '../../../styles/stylevariables';
import { hostCredentials, reqBody } from './config';
import InputAmount from './input/InputAmount';
import createTransaction from './utils/createTransaction';
import useLogOn from '../../../hooks/useLogOn';
import options from './settings/settings';
import useGetTransaction from '../../../hooks/useGetTransaction';
import { SharedStyledContainer, SharedStyledHeader } from '../../shared/DraggableModal/ModalTemplate';
import TransactionDetails from './TransactionDetails/TransactionDetails';
import { IntlConfigType } from '../../../types/IntlConfigType';
import TurnOnDevice from '../../shared/TurnOnDevice';
import useStopTransaction from '../../../hooks/useStopTransaction';
import ScanQr from './host/ScanQr';

const DemoAppContainer = styled.div`
  display: grid;
  grid-template-rows: 40px 70px 35px 1fr; 
  margin: auto;
  width: 83%;
  height: 87%;
`;
const Content = styled.div`
  padding: 0 4px 10px;
  display: flex;
  flex-direction: column;
  overflow-y: sunset;
`;

const StyledHeader = styled(SharedStyledHeader)({
  justifyContent: 'center',
});

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: flex-start;
  padding-top: 15px;
`;
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
`;
const StopButton = styled(OkButton)`
  background-color: ${Sv.red}; 
  &:active {
    background-color: ${Sv.darkred};
  }
`;
const TransactionDetailsHeader = styled.div`
  color: white;
  width: 100%;
  height: 100%;
  padding: 4px 6px;
  font-size: 0.82em;
  background-color: ${Sv.asphalt}; 
  border-bottom: 1px solid  ${Sv.appBackground};
  border-radius: 3px 3px 0 0;
  
`;
const TransactionDetailsContent = styled.div`
  color: white;
  width: 100%;
  height: 100%;
  padding: 4px 6px;
  font-size: 0.82em;
  background-color: ${Sv.asphalt}; 
`;
const TransactionDetailsFooter = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  font-size: 0.82em;
  align-items: baseline;
  background-color: ${Sv.asphalt}; 
  border-top: 1px solid ${Sv.appBackground};
  border-radius: 0 0 3px 3px;
`;
const blinkAnimation = keyframes`
  90%, 100% {
    opacity: 1;
  }
  10% {
    opacity: 0;
  }
`;
const StatusText = styled.div<{ $isActive: boolean }>`
  color: ${props => (props.$isActive ? Sv.green : Sv.red)};
`;
const BlinkingDot = styled(StatusText)`
  width: 6px;
  height: 6px;
  background-color: ${props => (props.$isActive ? Sv.green : Sv.red)};
  border-radius: 100px;
  margin: 10px 7px;
  animation-name: ${blinkAnimation};
  animation-duration: 1.0s;
  animation-iteration-count: infinite;
  }
`;

const DemoApp = () => {
  const [init, setInit] = useState(false);
  const { token, logOn } = useLogOn(hostCredentials, reqBody, 'payment-terminal');
  const [standByText, setStandByText] = useState<string>('OFF');

  const [isActive, setIsActive] = useState(false);
  const [transactionIdApp, setTransactionIdApp] = useState('');
  const { stopTransaction } = useStopTransaction(token, reqBody, transactionIdApp);
  const { transactionDetails, getTransaction } = useGetTransaction(token, transactionIdApp);

  const [intlConfig, setIntlConfig] = useState<IntlConfigType>(options[0]);
  const [value, setValue] = useState<string | undefined>('123');

  const handleOnValueChange = (givenValue: string | undefined): void => {
    setValue(givenValue);
  };

  const handleIntlSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const config = options[Number(event.target.value)];
    if (config) {
      setIntlConfig(config);
    }
  };

  // get transaction ID with the useGetTransaction hook
  const getTransactionId = useCallback(() => {
    setTransactionIdApp('');
    getTransaction();
  }, [getTransaction]);

  const stopHandler = useCallback(() => {
    stopTransaction();
    getTransactionId();
    setIsActive(false);
  }, [getTransactionId, stopTransaction]);

  const logInButtonHandler = useCallback(async () => {
    if (!init) {
      try {
        await logOn()
          .then(success => {
            if (success) {
              setStandByText(' • •');
              setInit(true);
              setStandByText('ON');
            } else {
              setStandByText('ERROR');
              setTimeout(() => {
                setStandByText('OFF');
              }, 4000);
              setInit(false);
            }
          });
      } catch (error) {
        console.error('Error during login:', error);
      }
    } else {
      setInit(false);
      setStandByText('OFF');
      stopHandler();
    }
  }, [init, logOn, stopHandler]);

  // update transactionDetails with transaction ID with the same hook
  // eslint-disable-next-line consistent-return
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
      transactionIdApp !== ''
      && (transactionDetails.status !== 'FAILED'
        && transactionDetails.status !== 'STOPPED'
        && transactionDetails.status !== 'TIMEDOUT'
        && transactionDetails.status !== 'DECLINED'
        && transactionDetails.status !== 'FINISHED')
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
    <SharedStyledContainer $isDraggable={true}>

      <ScanQr />
       <TurnOnDevice init={init} logInButtonHandler={logInButtonHandler} standByText={standByText} />
      <StyledHeader>Demo App</StyledHeader>
      <Content>
        <DemoAppContainer>

          <InputAmount value={value} handleOnValueChange={handleOnValueChange} intlConfig={intlConfig} handleIntlSelect={handleIntlSelect} />

          <ButtonContainer>
            {isActive ? <StopButton type="button" onClick={stopHandler} >Stop</StopButton>
              : <OkButton type="button" onClick={() => createTransaction(token, value, setTransactionIdApp, intlConfig)} disabled={!init}>
                OK</OkButton>}
          </ButtonContainer>

          <TransactionDetailsHeader>
            TransactionId:<br/>
            {transactionIdApp}
            </TransactionDetailsHeader>

           <TransactionDetailsContent>

            {isActive ? (<TransactionDetails transactionDetails={transactionDetails} />
            ) : ''}

          </TransactionDetailsContent>
          <TransactionDetailsFooter>
            <BlinkingDot $isActive={isActive} /> <StatusText $isActive={isActive}>{transactionDetails.status}</StatusText>
          </TransactionDetailsFooter>
        </DemoAppContainer>

      </Content>
    </SharedStyledContainer>
  );
};

export default DemoApp;
