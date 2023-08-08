import { useState, useCallback } from 'react';
import { Container, Header } from "../../shared/DraggableModal/ModalTemplate";
import NewQr from "./NewQr";
import { Lang } from "../PaymentDevice/utils/settingsReducer";
import ts from "./Translations/translations";
import QrCodeReader from "./QrCodeReader";
import QrCodes from "./QrCodes";

export enum QrModi {
  QR_SCANNER = "qrCodeReader",
  NEW_QR = "newQr",
  QR_CODES = "qrCodes",
}

const QrScanner = () => {
    
    const [currentModus, setCurrentModus] = useState(QrModi.QR_SCANNER);

    const modusSetter = useCallback((modus: QrModi) => setCurrentModus(modus), []);




  return (
    <Container>
      <Header>{ ts(currentModus, Lang.ENGLISH) }</Header>
   
        { currentModus === QrModi.QR_SCANNER ? <QrCodeReader modusSetter={modusSetter} /> : null }
        { currentModus === QrModi.NEW_QR ? <NewQr modusSetter={modusSetter}/> : null }
        { currentModus === QrModi.QR_CODES ? <QrCodes modusSetter={modusSetter}/> : null }
 
    </Container>
  );
};

export default QrScanner;







