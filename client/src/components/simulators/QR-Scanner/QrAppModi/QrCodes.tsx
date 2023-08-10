import styled from "styled-components";
import { QrAppModi, QrCode } from "..";
import * as S from "../../../shared/DraggableModal/ModalTemplate";
import Checkmark from "./checkmark";
import { useEffect, useState } from "react";


const QrCodesWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr auto; 
`

export const Wrap = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
`;


const SelectionDiv = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid black;
  cursor: pointer;
`;



type Props = {
    currentModus: QrAppModi;
    modusSetterHandler: (modus: QrAppModi) => void;
    qrCodes: QrCode[];
    selectQrCodeHandler: (selectedQrCode: QrCode) => void;
    currentQrCode: QrCode;
    deleteQrCodesHandler: (qrCodesToDelete: QrCode[]) => void;
}

const QrCodes = ({currentModus, modusSetterHandler, qrCodes, selectQrCodeHandler, currentQrCode, deleteQrCodesHandler }: Props) => {
  const [selectedQrCodesForDeletion, setSelectedQrCodesForDeletion] = useState<QrCode[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  const toggleSelectedQrCodeForDeletion = (qrCode: QrCode) => {
    if (selectedQrCodesForDeletion.includes(qrCode)) {
      setSelectedQrCodesForDeletion(selectedQrCodesForDeletion.filter((code) => code !== qrCode));
    } else {
      setSelectedQrCodesForDeletion([...selectedQrCodesForDeletion, qrCode]);
    }
  };

  const selectOrDeselectAllHandler = () => {
    if (allSelected) {
      // Deselect all
      setSelectedQrCodesForDeletion([]);
    } else {
      // Select all
      setSelectedQrCodesForDeletion(qrCodes);
    }
  };

  useEffect(() => {
    // Check if all schemes are selected
    const allQrCodes = Object.values(qrCodes);
    const areAllSchemesSelected = allQrCodes.every((qr) =>
     selectedQrCodesForDeletion.includes(qr)
    );
    areAllSchemesSelected ? setAllSelected(true) : setAllSelected(false);
    }, [qrCodes, selectedQrCodesForDeletion]);

  return (
      <QrCodesWrapper>    
          <S.GenericList>
          {qrCodes.map((qr, index) => (
          <S.GenericListButton key={`${qr}_${index}`} onClick={() => selectQrCodeHandler(qr)}>
            <Wrap>
              
            {currentModus === QrAppModi.DEL_QR && (
              <SelectionDiv
                onClick={(event) => {
                  event.stopPropagation();
                  toggleSelectedQrCodeForDeletion(qr);
                }}
                style={{
                  backgroundColor: selectedQrCodesForDeletion.includes(qr) ? "black" : "white",
                }}
              />
            )}    

          <span>{qr.name}</span>
          </Wrap>


          

        


          { currentModus !== QrAppModi.EDIT_LIST && currentModus !== QrAppModi.DEL_QR && <Checkmark isDisplayed={currentQrCode === qr }/> }
        </S.GenericListButton>
      ))}
        </S.GenericList>
        { currentModus !== QrAppModi.EDIT_LIST &&
       <S.GenericFooter>
         { currentModus !== QrAppModi.DEL_QR && <button onClick={()=>modusSetterHandler(QrAppModi.NEW_QR)}>New</button> }       
         { currentModus !== QrAppModi.DEL_QR && <button onClick={()=>modusSetterHandler(QrAppModi.EDIT_LIST)} disabled={qrCodes.length === 0 }>Edit</button> }
         { currentModus !== QrAppModi.DEL_QR && <button onClick={()=>modusSetterHandler(QrAppModi.DEL_QR)} disabled={qrCodes.length === 0 }>Delete</button> }

        { currentModus === QrAppModi.DEL_QR && <button type="button" onClick={selectOrDeselectAllHandler}>{ allSelected ? 'Deselect all' : 'Select all' }</button> }
        { currentModus === QrAppModi.DEL_QR && <button type="button" onClick={() => deleteQrCodesHandler(selectedQrCodesForDeletion)} disabled={selectedQrCodesForDeletion.length === 0 }>Delete</button> }
        
       </S.GenericFooter>
    }
      </QrCodesWrapper>
  );
};

export default QrCodes;








