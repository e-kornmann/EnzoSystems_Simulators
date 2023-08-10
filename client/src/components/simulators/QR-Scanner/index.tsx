import { useEffect, useState } from 'react';
import { ReactComponent as CloseIcon } from '../../../assets/svgs/close.svg'
import { ReactComponent as Arrow } from '../../../assets/svgs/arrow_back.svg'
import { styled } from 'styled-components';
import { Container, Header } from "../../shared/DraggableModal/ModalTemplate";
import QrForm from "./QrAppModi/QrForm";
import ts from "./Translations/translations";
import QrCodeReader from "./QrAppModi/QrCodeReader";
import QrCodes from "./QrAppModi/QrCodes";
import { Lang } from '../PaymentDevice/DeviceSettings/AvailableSettings/LanguageOptions';
import DemoApp from './host';

export enum QrAppModi {
  QR_SCANNER = 'qrCodeReader',
  NEW_QR = 'newQrForm',
  EDIT_LIST = 'editQrList',
  EDIT_QR = 'editQrForm',
  DEL_QR = 'deleteQr',
  QR_CODES = 'qrCodes',
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
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);
  const [currentQrCode, setCurrentQrCode] = useState<QrCode>({ name: '', data: '' });
  const [qrCodeToEdit, setQrCodeToEdit] = useState<QrCode>({ name: '', data: '' });
  const [init, setInit] = useState(false);
  const [hostIsEnabled, setHostIsEnabled] = useState(false);


  const hostIsEnabledListener = () => setHostIsEnabled(!hostIsEnabled);

  //log-on Device
  useEffect(() => {
    if (init === false) {
      setInit(!init);
    }
  }, [init])
  //     const doLogOn = async () => {
  //       const logOnSucceeded = await logOn();
  //       setInit(logOnSucceeded);
  //     };
  //     doLogOn();
  //   }
  // }, [init, logOn]);


  const modusSetterHandler = (modus: QrAppModi) => setCurrentModus(modus);

  const saveNewQrCodeHandler = (newQrCode: QrCode) => {
    if (currentModus === QrAppModi.NEW_QR) {
      setQrCodes([...qrCodes, newQrCode]);
      setCurrentQrCode(newQrCode);
    }
    if (currentModus === QrAppModi.EDIT_QR) {
      const updatedQrCodes = qrCodes.map((qr) =>
        qr.name === newQrCode.name ? newQrCode : qr
      );
      setQrCodes(updatedQrCodes);
      setCurrentQrCode(newQrCode);
    }
  };

  const deleteQrCodesHandler = (qrCodesToDelete: QrCode[]) => {
    const updatedQrCodes = qrCodes.filter(qrCode =>
      !qrCodesToDelete.includes(qrCode)
    );
    setQrCodes(updatedQrCodes);
    setCurrentModus(QrAppModi.QR_CODES);
  };

  const selectQrCodeHandler = (selectedQrCode: QrCode) => {
    if (currentModus === QrAppModi.QR_CODES) {
      setCurrentQrCode(selectedQrCode);
      setTimeout(()=>setCurrentModus(QrAppModi.QR_SCANNER), 100);
    }
    if (currentModus === QrAppModi.EDIT_LIST) {
      setQrCodeToEdit(selectedQrCode);
      setCurrentQrCode(selectedQrCode);
      setCurrentModus(QrAppModi.EDIT_QR);
    }
  };

  return (
    <Container>
      <DemoApp hostIsEnabledListener={hostIsEnabledListener}/>
      <NavigationHeader>
        <div>
          {currentModus === QrAppModi.EDIT_QR ||
            currentModus === QrAppModi.DEL_QR &&
            <Arrow width={12} height={12} onClick={() => setCurrentModus(QrAppModi.QR_CODES)} style={{ top: '2px' }} />}
        </div>
        {ts(currentModus, Lang.ENGLISH)}
        <div>
          {currentModus !== QrAppModi.QR_SCANNER &&
            <CloseIcon width={11} height={11} onClick={() => { setCurrentModus(QrAppModi.QR_SCANNER) }} />}
        </div>
      </NavigationHeader>
        
   { currentModus === QrAppModi.QR_SCANNER ? <QrCodeReader modusSetterHandler={modusSetterHandler} currentQrCode={currentQrCode} init={init} hostIsEnabled={hostIsEnabled}/> : null}
      { currentModus === QrAppModi.NEW_QR ? <QrForm modusSetterHandler={modusSetterHandler} saveNewQrCodeHandler={saveNewQrCodeHandler} isEditMode={false} /> : null}
      { currentModus === QrAppModi.EDIT_QR ? <QrForm modusSetterHandler={modusSetterHandler} saveNewQrCodeHandler={saveNewQrCodeHandler} isEditMode={true} qrCodeToEdit={qrCodeToEdit} /> : null}
      { currentModus === QrAppModi.QR_CODES || 
        currentModus === QrAppModi.EDIT_LIST || 
        currentModus === QrAppModi.DEL_QR ? <QrCodes currentModus={currentModus} deleteQrCodesHandler={deleteQrCodesHandler} modusSetterHandler={modusSetterHandler} qrCodes={qrCodes} selectQrCodeHandler={selectQrCodeHandler} currentQrCode={currentQrCode} /> : null}
 
    </Container>
  );
};

export default QrScanner;
