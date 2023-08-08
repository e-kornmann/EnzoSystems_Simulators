import styled from "styled-components";
import {  QrModi } from ".";
import { GenericFooter } from "../../shared/DraggableModal/ModalTemplate";


const QrCodesWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 26px; 
  justify-content: center;
  align-items: center;
  line-height: 0.9em;
  margin: auto;
  width: 80%;
  height: 90%;
`

type Props = {
    modusSetter: (modus: QrModi) => void;
}


const NewQr = ({modusSetter}: Props) => {
  
  return (
      <QrCodesWrapper>    
        <div>New QR</div>
            <GenericFooter>
        <div>Save</div>
        <div>qr</div>
            </GenericFooter>
      </QrCodesWrapper>

  );
};

export default NewQr;







