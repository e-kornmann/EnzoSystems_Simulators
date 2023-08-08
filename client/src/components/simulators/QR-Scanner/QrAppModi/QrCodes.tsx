import styled from "styled-components";
import { QrAppModi, QrCode } from "..";
import * as S from "../../../shared/DraggableModal/ModalTemplate";
import Checkmark from "./checkmark";


const QrCodesWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr auto; 
`


type Props = {
    modusSetterHandler: (modus: QrAppModi) => void;
    qrCodes: QrCode[];
    selectQrCodeHandler: (selectedQrCode: QrCode) => void;
    currentQrCode: QrCode;
}


const NewQr = ({modusSetterHandler, qrCodes, selectQrCodeHandler, currentQrCode }: Props) => {

  
  
  return (
      <QrCodesWrapper>    
          <S.GenericList>
          {qrCodes.map((qr, index) => (
          <S.GenericListButton key={`${qr}_${index}`} onClick={() => selectQrCodeHandler(qr)}>
          {qr.name}
          <Checkmark isDisplayed={currentQrCode === qr }/> 
        </S.GenericListButton>
      ))}
        </S.GenericList>
       <S.GenericFooter>
        
   <button onClick={()=>modusSetterHandler(QrAppModi.EDIT_CODE)} disabled={qrCodes.length === 0 }>Edit</button> 
    <button onClick={()=>modusSetterHandler(QrAppModi.DEL_CODE)} disabled={qrCodes.length === 0 }>Delete</button> 
       </S.GenericFooter>
      </QrCodesWrapper>

  );
};

export default NewQr;








