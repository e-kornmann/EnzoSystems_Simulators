import styled from "styled-components";
import SuccessIcon from "../../../shared/Success";
import * as Sv from "../../../../styles/stylevariables";
import { QrAppModi, QrCode } from "..";
import { GenericFooter } from "../../../shared/DraggableModal/ModalTemplate";
import { useState } from "react";
import { ReactComponent as CrossHairIcon } from '../../../../assets/svgs/crosshair.svg'
import { ReactComponent as QrCodeIcon } from '../../../../assets/svgs/qr_code.svg'
import { ReactComponent as AddIcon } from '../../../../assets/svgs/add.svg'
import ts from "../Translations/translations";
import { Lang } from "../../PaymentDevice/utils/settingsReducer";


const QrScannerWrapper = styled.div`
  display: grid;
  grid-template-rows: 14% 16% 1fr 20% auto; 
  row-gap: 2%;
`

const InstructionBox = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  font-size: 1.25em;
  font-weight: 500;
`

const IconBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`

const ScannerBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
`

const ButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`


const ScanActionButton = styled.button`
  background-color: ${Sv.enzoOrange};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 4px;
  color: white;
  height: 50%;
  width: 85%;
  font-weight: 300;
  font-size: 0.9em;
  border-radius: 2px;
  cursor: pointer;
  z-index: 300;
  border-radius: 6px;
  &:active {
    background-color: ${Sv.enzoDarkOrange};
  }
  & > svg {
    position: relative;
    top: -1px;
    fill: white;
    margin-right: 5px;
  }
  &:disabled {
    background-color: ${Sv.gray};
    cursor: inherit;
    &:active {
      background-color: ${Sv.gray};
    }
  }
  `;


enum ScannerMode {
 IDLE = 'readyToScan',
}


type Props = {
  modusSetterHandler: (modus: QrAppModi) => void;
  currentQrCode: QrCode;
}



const QrCodeReader = ({modusSetterHandler, currentQrCode}: Props) => {
    const [scannerMode, setScannerMode] = useState(ScannerMode.IDLE);
    const [scanIsSuccess, setScanIsSuccess] = useState(false);





  return (
    
    <QrScannerWrapper>    
      <InstructionBox>{ ts(scannerMode, Lang.ENGLISH) }</InstructionBox>
      <IconBox>{ scanIsSuccess ? <SuccessIcon width={30} height={30} fill={Sv.green} /> : null }</IconBox>
      <ScannerBox><CrossHairIcon /></ScannerBox>
     <ButtonBox> 
      <ScanActionButton type="button" onClick={()=>(true)} disabled={!currentQrCode.name || !currentQrCode.data}>
        <QrCodeIcon width={15} height={15} />{ !currentQrCode.name ? 'No Qr-Codes' : currentQrCode.name }</ScanActionButton>
     </ButtonBox>
    <GenericFooter>
        <div onClick={()=> modusSetterHandler(QrAppModi.NEW_QR)}><AddIcon/>New</div>
        <div onClick={()=> modusSetterHandler(QrAppModi.QR_CODES)}><QrCodeIcon />QRs</div>
    </GenericFooter>
  </QrScannerWrapper>

  );
};

export default QrCodeReader;







