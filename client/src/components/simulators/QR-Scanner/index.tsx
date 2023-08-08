import { useState, useCallback } from 'react';
import { ReactComponent as CloseIcon } from '../../../assets/svgs/close.svg'
import { ReactComponent as Arrow } from '../../../assets/svgs/arrow_back.svg'
import { styled } from 'styled-components';
import { Container, Header } from "../../shared/DraggableModal/ModalTemplate";
import NewQr from "./QrAppModi/NewQr";
import { Lang } from "../PaymentDevice/utils/settingsReducer";
import ts from "./Translations/translations";
import QrCodeReader from "./QrAppModi/QrCodeReader";
import QrCodes from "./QrAppModi/QrCodes";

export enum QrAppModi {
  QR_SCANNER = "qrCodeReader",
  NEW_QR = "newQr",
  QR_CODES = "qrCodes",
  EDIT_CODE = "editQrCode",
  DEL_CODE = "deleteQrCode",
}

export type QrCode = {
  name: string;
  data: string;
}

const NavigationHeader = styled(Header)`  
  padding: 0 8px 0 9px;
  justify-content: space-between;
`;

const QrScanner = () => {
  const [currentModus, setCurrentModus] = useState(QrAppModi.QR_SCANNER);
  const [qrCodes, setQrCodes] = useState<QrCode[]>([])
  const [currentQrCode, setCurrentQrCode] = useState<QrCode>({name: '', data: ''});

  
  const modusSetterHandler = (modus: QrAppModi) => setCurrentModus(modus)
  
  const saveNewQrCodeHandler = (newQrCode: QrCode) => { 
    setQrCodes([...qrCodes, newQrCode]); 
    setCurrentQrCode(newQrCode); 
  }

  const selectQrCodeHandler = (selectedQrCode: QrCode) => setCurrentQrCode(selectedQrCode);

  return (
    <Container>
      <NavigationHeader>
        <div>
          {currentModus === QrAppModi.EDIT_CODE ||
            currentModus === QrAppModi.DEL_CODE && 
            <Arrow width={12} height={12} onClick={() => setCurrentModus(QrAppModi.QR_CODES)} style={{ top: '2px' }} />}
        </div>
        {ts(currentModus, Lang.ENGLISH)}
        <div>
          {currentModus !== QrAppModi.QR_SCANNER && 
          <CloseIcon width={11} height={11} onClick={() => { setCurrentModus(QrAppModi.QR_SCANNER) }} />}
        </div>
      </NavigationHeader>

      {currentModus === QrAppModi.QR_SCANNER ? <QrCodeReader modusSetterHandler={modusSetterHandler} currentQrCode={currentQrCode} /> : null}
      {currentModus === QrAppModi.NEW_QR ? <NewQr modusSetterHandler={modusSetterHandler} saveNewQrCodeHandler={saveNewQrCodeHandler} qrCodes={qrCodes}/> : null}
      {currentModus === QrAppModi.QR_CODES ? <QrCodes modusSetterHandler={modusSetterHandler} qrCodes={qrCodes} selectQrCodeHandler={selectQrCodeHandler} currentQrCode={currentQrCode} /> : null}

    </Container>
  );
};

export default QrScanner;
