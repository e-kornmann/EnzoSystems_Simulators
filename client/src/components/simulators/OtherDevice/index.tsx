import styled from 'styled-components';
import * as Sv from '../../../styles/stylevariables';
import { hostCredentials, reqBody } from './config';
import Example3 from './input';
import * as S from '../../../styles/App.style';
import { useState, useEffect, useCallback } from 'react';
import createTransaction from '../../../utils/createTransaction';

import stopTransaction from '../../../utils/stopTransactionHost';
import useLogOn from '../../../hooks/useLogOn';
import { CurrencyInputProps } from './CurrencyInputProps';
import { options } from './utils/settings/settings';
import useGetTransaction from '../../../hooks/useGetTransaction';
import { Container, Content, Header } from '../../shared/DraggableModal/ModalTemplate';


const OkButton = styled.button`
  cursor: pointer;
  width: 100px;
  min-width: 0;
  background-color: ${Sv.green}; 
`;

const StopButton = styled(OkButton)`
  background-color: ${Sv.red}; 
`;

const OtherDevice = () => {
  const [init, setInit] = useState(false);
  const { token, logOn } = useLogOn(hostCredentials, reqBody);
  const [ isActive, setIsActive] = useState(false);
  const [ transactionIdApp, setTransactionIdApp ] = useState('');
  const { transactionDetails, getTransaction } = useGetTransaction(token, transactionIdApp);
  const [intlConfig, setIntlConfig] = useState<CurrencyInputProps['intlConfig']>(options[0]);
  const [value, setValue] = useState<string | undefined>('123');
  const [rawValue, setRawValue] = useState<string | undefined>(' ');

  const handleOnValueChange = (value: string | undefined): void => {
    setRawValue(value === undefined ? 'undefined' : value || ' ');
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
      setTimeout(()=>doLogOn(),5000);
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
    setValue('123');
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



  const transIdMessage = isActive ? `${transactionIdApp}` : null;    

  return (
    <Container>
        <Header>Other Device</Header>
        <Content>
          <S.BlinkingDot $isActive={isActive}/> <S.StatusText>{transactionDetails.status}</S.StatusText>
          <Example3 value={value} handleOnValueChange={handleOnValueChange} intlConfig={intlConfig} handleIntlSelect={handleIntlSelect}/>
          <S.AmountText>{ transIdMessage }</S.AmountText>
        
        <StopButton type="button" onClick={() => stopTransaction(token, transactionIdApp, setIsActive, reset)} > Stop</StopButton>
        <OkButton type="button" onClick={() => createTransaction(token, rawValue, setTransactionIdApp)} > OK</OkButton>
        <S.ConnectMessage $init={init}>{import.meta.env.VITE_HOST_ID} { init ? 'is logged in to the Enzo Pay API' : 'has to be loggin to the Enzo Pay API to create a transaction'}</S.ConnectMessage>
        </Content>
    </Container>
  );
};

export default OtherDevice;







