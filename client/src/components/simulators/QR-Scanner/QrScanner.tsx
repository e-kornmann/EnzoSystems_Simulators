import styled from "styled-components";
import { useState, useCallback } from 'react';
import { Container, Content, Header } from "../../shared/DraggableModal/ModalTemplate";
import SuccessIcon from "../../shared/Success";
import * as Sv from "../../../styles/stylevariables";
import NewQr from "./NewQr";


const QrScannerWrapper = styled.div`
  display: grid;
  grid-template-rows: 10% 20% 1fr 26px; 
  justify-content: center;
  align-items: center;
  line-height: 0.9em;
  margin: auto;
  width: 80%;
  height: 90%;
`

const Footer = styled.footer`
  font-size: 12px;
  color: pink;
  width: 100%;
  height: 100%;
  bottom: 0px;
  display: flex;
  justify-content: space-between;
  
  background-color: white;
  border-radius: 0 0 5px 5px;
`

const QrScanner = () => {
    
    const [header, setHeader] = useState('QR-code reader');

    const headerSetter = useCallback((headerText: string) => setHeader(headerText), []);




  return (
    <Container>
      <Header>{header}</Header>
      <Content>
        { header === 'New QR code' ?  <NewQr /> :
      <QrScannerWrapper>    
       

        <div>Ready to scan</div>
        <div><SuccessIcon width={30} height={30} fill={Sv.green} /></div>
        <div>QRblock</div>
        <Footer>
            <div onClick={()=> headerSetter('New QR code')}>new</div>
            <div>qr</div>
        </Footer>
      </QrScannerWrapper>
}
      </Content>
    </Container>
  );
};

export default QrScanner;







