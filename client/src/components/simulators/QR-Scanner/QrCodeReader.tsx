import styled from "styled-components";
import SuccessIcon from "../../shared/Success";
import * as Sv from "../../../styles/stylevariables";
import { QrModi } from ".";
import { GenericFooter } from "../../shared/DraggableModal/ModalTemplate";


const QrScannerWrapper = styled.div`
  display: grid;
  grid-template-rows: 10% 20% 1fr 26px; 
  justify-content: center;
  align-items: center;
  line-height: 0.9em;
  margin: auto;
  width: 100%;
  height: 100%;
  background-color: gray;
`


type Props = {
    modusSetter: (modus: QrModi) => void;
}



const QrCodeReader = ({modusSetter}: Props) => {
    





  return (



    <QrScannerWrapper>    
       

    <div>Ready to scan</div>
    <div><SuccessIcon width={30} height={30} fill={Sv.green} /></div>
    <div>QRblock</div>
    <GenericFooter>
        <div onClick={()=> modusSetter(QrModi.NEW_QR)}>new</div>
        <div onClick={()=> modusSetter(QrModi.QR_CODES)}>QR's</div>
    </GenericFooter>
  </QrScannerWrapper>

  );
};

export default QrCodeReader;







