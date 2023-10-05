import styled, { keyframes } from 'styled-components';
import { useState, useEffect, useCallback } from 'react';
import { axiosUrl, hostCredentials, reqBody } from './src/config';
import InputAmount from './src/input/InputAmount';
import createTransaction from './src/utils/createTransaction';
import useLogOn from './local_hooks/useLogOn';
import options from './src/settings/settings';
import useGetTransaction from './local_hooks/useGetTransaction';
import { SharedStyledContainer, SharedStyledHeader } from './local_shared/DraggableModal/ModalTemplate';
import TransactionDetails from './src/TransactionDetails/TransactionDetails';
import { IntlConfigType } from './src/types/IntlConfigType';
import TurnOnDevice from './local_shared/TurnOnDevice';
import useStopTransaction from './local_hooks/useStopTransaction';
import ScanQr from './src/host/ScanQr';

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
  color: ${props => props.theme.colors.text.black};
  width: 60px;
  height: 30px;
  font-size: 1.0em;
  font-weight: 600;
  min-width: 0;
  background-color: ${props => props.theme.colors.buttons.green};
  border-radius: 40px;
  padding: 3px;
  &:active {
    background-color: ${props => props.theme.colors.buttons.darkgreen};
  }
  &:disabled {
    cursor: inherit;
    background-color: ${props => props.theme.colors.buttons.gray};
    color: gray;
  }
`;
const StopButton = styled(OkButton)`
  background-color: ${props => props.theme.colors.buttons.red};
  &:active {
    background-color: ${props => props.theme.colors.buttons.darkred};
  }
`;
const TransactionDetailsHeader = styled.div`
  color: white;
  width: 100%;
  height: 100%;
  padding: 4px 6px;
  font-size: 0.82em;
  background-color: ${props => props.theme.colors.text.primary}; 
  border-bottom: 1px solid  ${props => props.theme.colors.background.secondary}; 
  border-radius: 3px 3px 0 0;
  
`;
const TransactionDetailsContent = styled.div`
  color: white;
  width: 100%;
  height: 100%;
  padding: 4px 6px;
  font-size: 0.82em;
  background-color: ${props => props.theme.colors.text.primary}; 
`;
const TransactionDetailsFooter = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  font-size: 0.82em;
  align-items: baseline;
  background-color:${props => props.theme.colors.text.primary}; 
  border-top: 1px solid ${props => props.theme.colors.background.secondary}; 
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
const StatusText = styled.div<{ $isActive: boolean }>(({ theme, $isActive }) => ({
  color: $isActive ? theme.colors.buttons.green : theme.colors.buttons.red,
}));
const BlinkingDot = styled(StatusText)`
  width: 6px;
  height: 6px;
  background-color: ${props => (props.$isActive ? props.theme.colors.buttons.green : props.theme.colors.buttons.red)};
  border-radius: 100px;
  margin: 10px 7px;
  animation-name: ${blinkAnimation};
  animation-duration: 1.0s;
  animation-iteration-count: infinite;
  }
`;

const DemoApp = () => {
  const [init, setInit] = useState(false);
  const { token, logOn } = useLogOn(hostCredentials, reqBody, axiosUrl);
  const [standByText, setStandByText] = useState<string>('OFF');

  const [isActive, setIsActive] = useState(false);
  const [transactionIdApp, setTransactionIdApp] = useState('');
  const { stopTransaction } = useStopTransaction(token, transactionIdApp, reqBody, axiosUrl);
  const { transactionDetails, getTransaction } = useGetTransaction(token, transactionIdApp, reqBody, axiosUrl);

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
              : <OkButton type="button" onClick={() => token && createTransaction(token, value, setTransactionIdApp, intlConfig)} disabled={!init}>
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
