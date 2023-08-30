import { useCallback, useEffect, useState } from 'react';
import { ReactComponent as CloseIcon } from '../../../assets/svgs/close.svg'
import { ReactComponent as Arrow } from '../../../assets/svgs/arrow_back.svg'
import { Container, SharedStyledHeader } from "../../shared/DraggableModal/ModalTemplate";
import QrForm from "./QrAppModi/QrForm";
import QrCodeReader from "./QrAppModi/QrCodeReader";
import QrCodesComponent from "./QrAppModi/QrCodes";
import { AppContextProvider } from './utils/settingsReducer';
import DeviceSettings from './QrAppModi/DeviceSettings/DeviceSettings';
import HeaderText from './HeaderText';

export enum QrAppModi {
  QR_SCANNER = 'qrCodeReader',
  NEW_QR = 'newQrForm',
  EDIT_LIST = 'editQrList',
  EDIT_QR = 'editQrForm',
  DEL_QR = 'deleteQr',
  QR_CODES = 'qrCodes',
  SETTINGS = 'settings',
  SET_LANGUAGE = 'defaultLanguage',
  SET_MODE = 'status'
}

export type QrCode = {
  name: string;
  data: string;
}


const QrScanner = () => { 
  
  const [currentModus, setCurrentModus] = useState(QrAppModi.QR_SCANNER);
  const [currentQrCode, setCurrentQrCode] = useState<QrCode>({ name: '', data: '' });
  const [qrCodeToEdit, setQrCodeToEdit] = useState<QrCode>({ name: '', data: '' });
  const [qrCodes, setQrCodes] = useState<QrCode[]>([]);

  const modusSetterHandler = (modus: QrAppModi) => setCurrentModus(modus);
  
  useEffect(()=> {
    const getQrCode = localStorage.getItem('qrCodes');
      if (getQrCode) setQrCodes(JSON.parse(getQrCode));
    const getCurrentQrCode = localStorage.getItem('currentQrCode');
      if (getCurrentQrCode) setCurrentQrCode(JSON.parse(getCurrentQrCode));
  }, [])

  useEffect(()=> {
    const getCurrentQrCode = localStorage.getItem('currentQrCode');
    if (currentQrCode && (!getCurrentQrCode || (getCurrentQrCode && getCurrentQrCode !== JSON.stringify(currentQrCode))))
      localStorage.setItem('currentQrCode', JSON.stringify(currentQrCode));
  }, [currentQrCode])

  useEffect(()=> {
    const getQrCode = localStorage.getItem('qrCodes');
    if (qrCodes && qrCodes.length > 0 && (!getQrCode || (getQrCode && getQrCode !== JSON.stringify(qrCodes))))
      localStorage.setItem('qrCodes', JSON.stringify(qrCodes));
  }, [qrCodes])
  
  // select QR code to edit or to show and put Data in currentQrCode variable.
  const selectQrCodeHandler = (selectedQrCode: QrCode) => {
    if (currentModus === QrAppModi.QR_CODES) {
      setCurrentQrCode(selectedQrCode);
      setCurrentModus(QrAppModi.QR_SCANNER);
    }
    if (currentModus === QrAppModi.EDIT_LIST) {
      setCurrentQrCode(selectedQrCode);
      setQrCodeToEdit(selectedQrCode);
      setCurrentModus(QrAppModi.EDIT_QR);
    }
  };

  // add new QR to qrCodes
  const saveNewQrCodeHandler = useCallback((newQrCode: QrCode) => {
      setQrCodes([...qrCodes, newQrCode]);
      setCurrentQrCode(newQrCode);
      setCurrentModus(QrAppModi.QR_SCANNER);
    }, [qrCodes]);
    
  // use the selected QR (currentQR) to check wich element needs to be updated, 
  // then update qrCodes and save updated QR to currentQrCode
    const updateQrCodeHandler = useCallback((newQrCode: QrCode) => {
      setQrCodes((prev) => prev.map((code) =>
      code.name === currentQrCode.name ? newQrCode : code ))
      setCurrentQrCode(newQrCode);
      setCurrentModus(QrAppModi.QR_SCANNER);
    }, [currentQrCode.name]);
  

  const deleteQrCodesHandler = (qrCodesToDelete: QrCode[]) => {
    const updatedQrCodes = qrCodes.filter(qrCode =>
      !qrCodesToDelete.includes(qrCode)
    );
    // take the first qrCode from the list if the currentQr code where the deleted one
    if (!updatedQrCodes.includes(currentQrCode)) setCurrentQrCode(qrCodes[0]);
      setQrCodes(updatedQrCodes);
      setCurrentModus(QrAppModi.QR_SCANNER);
  };

  return (
    <AppContextProvider>


      <Container>

        <SharedStyledHeader>
          <button type="button" disabled={currentModus !== QrAppModi.EDIT_QR && currentModus !== QrAppModi.DEL_QR}  onClick={() => modusSetterHandler(QrAppModi.QR_CODES)}>
            { currentModus === QrAppModi.EDIT_QR ||
              currentModus === QrAppModi.DEL_QR &&
              <Arrow width={12} height={12} />}
          </button>
          <HeaderText currentModus={currentModus}/>
          <button type="button" disabled={currentModus === QrAppModi.QR_SCANNER}  onClick={() => { modusSetterHandler(QrAppModi.QR_SCANNER) }}>
             {currentModus !== QrAppModi.QR_SCANNER &&
               <CloseIcon width={11} height={11} />} 
           </button>
        </SharedStyledHeader>

        <QrCodeReader modusSetterHandler={modusSetterHandler} currentQrCode={currentQrCode} />
        {(
          currentModus !== QrAppModi.QR_SCANNER &&
          currentModus !== QrAppModi.NEW_QR &&
          currentModus !== QrAppModi.EDIT_LIST &&
          currentModus !== QrAppModi.EDIT_QR &&
          currentModus !== QrAppModi.DEL_QR &&
          currentModus !== QrAppModi.QR_CODES
          ) && <DeviceSettings modusSetterHandler={modusSetterHandler} />}
        <QrForm updateQrCodeHandler={updateQrCodeHandler} saveNewQrCodeHandler={saveNewQrCodeHandler} currentModus={currentModus} qrCodeToEdit={qrCodeToEdit} />
        <QrCodesComponent qrCodes={qrCodes} modusSetterHandler={modusSetterHandler} selectQrCodeHandler={selectQrCodeHandler} currentModus={currentModus} currentQrCode={currentQrCode} deleteQrCodesHandler={deleteQrCodesHandler} />
      </Container>
      
    </AppContextProvider>
  );
};

export default QrScanner;

