import styled from "styled-components";
import { QrCode, QrAppModi } from "..";
import * as S from "../../../shared/DraggableModal/ModalTemplate";
import { useState } from "react";

const NewQrWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr auto; 
`

const NewQrForm = styled.form`
  display: grid;
  padding: 30px;
  grid-template-rows: 30px 1fr; 
  row-gap: 30px;
  justify-items: center; 
  align-items: center;
`

type Props = {
  modusSetterHandler: (modus: QrAppModi) => void;
  saveNewQrCodeHandler: (newQrCode: QrCode) => void;
  qrCodes: QrCode[];
}

const oneQrCode = {
  name: 'This is my Qr-code',
  data: 'Here you can place any information you want'
}




const NewQr = ({modusSetterHandler, saveNewQrCodeHandler, qrCodes }: Props) => {
    const [qrCode, setQrcode] = useState<QrCode>({name: '', data: ''});

    const addQrCode = () => { 
      setQrcode(oneQrCode); 
    }

    const saveButtonHandler = () => {
      const qrId = qrCodes.length;
      saveNewQrCodeHandler({...qrCode, name: `${qrCode.name}_${qrId}`});
      setTimeout(() => modusSetterHandler(QrAppModi.QR_SCANNER), 300 ); 
    }
    
  return (
      <NewQrWrapper>    
        <NewQrForm><div onClick={addQrCode}>Add New QR</div></NewQrForm>
        <S.GenericFooter>
            <button onClick={saveButtonHandler} style={{marginLeft: "auto"}} disabled={!qrCode.name || !qrCode.data}>Save</button>
          </S.GenericFooter>
      </NewQrWrapper>

  );
};

export default NewQr;







