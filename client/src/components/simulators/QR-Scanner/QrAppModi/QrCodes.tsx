import styled from "styled-components";
import * as S from "../../../shared/DraggableModal/ModalTemplate";
import Checkmark from "./checkmark";
import { useEffect, useState } from "react";
import * as Sv from "../../../../styles/stylevariables";
import { QrAppModi, QrCode } from "..";

const QrCodesWrapper = styled.form`
  position: absolute;
  top: 35px;
  height: calc(100% - 35px);
  width: 100%;
  border-radius: 0 0 5px 5px;
  background-color: ${Sv.appBackground};
  display: grid;
  grid-template-rows: 1fr auto; 
  z-index: 400;
`;

export const Wrap = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
`;

const SelectionDiv = styled.div<{$isSelected: boolean}>`
  display: flex;
  align-items: center;
  width: 12px;
  height: 12px;
  border: 1px solid ${props => props.$isSelected ? Sv.enzoOrange : Sv.asphalt};
  border-radius: 1px;
  cursor: pointer;
  background-color: ${props => props.$isSelected ? Sv.enzoOrange : 'white'};
  & > svg {
    margin-left: 1px;
  }
`;

type Props = {
  qrCodes: QrCode[];
  modusSetterHandler: (modus: QrAppModi ) => void;
  selectQrCodeHandler: (selectedQrCode: QrCode) => void;
  currentModus: QrAppModi;
  currentQrCode: QrCode;
  deleteQrCodesHandler: (qrCodesToDelete: QrCode[]) => void;
  
};

const QrCodesComponent = ({ qrCodes, modusSetterHandler, selectQrCodeHandler, currentModus, currentQrCode, deleteQrCodesHandler }: Props) => {
  
    const [selectedQrCodesForDeletion, setSelectedQrCodesForDeletion] = useState<QrCode[]>([]);
    const [allSelected, setAllSelected] = useState(false);
    const [showQrCodes, setShowQrCodes] = useState(false);
    
    useEffect(()=>  {
      if (
      currentModus === QrAppModi.QR_CODES || 
      currentModus === QrAppModi.EDIT_LIST || 
      currentModus === QrAppModi.DEL_QR ) {
       setShowQrCodes(true);
    } else {
      setShowQrCodes(false);
    }
  
    }, [currentModus])


  
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

    showQrCodes &&
    <QrCodesWrapper>
      <S.GenericList>
        {qrCodes.map((qr, index) => (
          <S.GenericListButton type="button" key={`${qr}_${index}`} onClick={() => selectQrCodeHandler(qr)}>
            <Wrap>
              {currentModus === QrAppModi.DEL_QR && (
                <SelectionDiv
                  onClick={() => {
                    toggleSelectedQrCodeForDeletion(qr);
                  }}
                  $isSelected={selectedQrCodesForDeletion.includes(qr)}
                ><Checkmark isDisplayed={selectedQrCodesForDeletion.includes(qr)} width={9} height={6} color={Sv.asphalt}/>
                </SelectionDiv>
              )}
              <span>{qr.name}</span>
            </Wrap>
            {currentModus !== QrAppModi.EDIT_LIST && currentModus !== QrAppModi.DEL_QR && <Checkmark isDisplayed={currentQrCode === qr } width={14} height={11} color={Sv.enzoOrange}/> }
          </S.GenericListButton>
        ))}
      </S.GenericList>
      {currentModus !== QrAppModi.EDIT_LIST && (
        <S.GenericFooter>
        { currentModus !== QrAppModi.DEL_QR && <button type="button" onClick={()=>modusSetterHandler(QrAppModi.NEW_QR)}>New</button> }       
        { currentModus !== QrAppModi.DEL_QR && <button onClick={()=>modusSetterHandler(QrAppModi.EDIT_LIST)} disabled={qrCodes.length === 0 }>Edit</button> }
        { currentModus !== QrAppModi.DEL_QR && <button onClick={()=>modusSetterHandler(QrAppModi.DEL_QR)} disabled={qrCodes.length === 0 }>Delete</button> }
        { currentModus === QrAppModi.DEL_QR && <button type="button" onClick={selectOrDeselectAllHandler}>{ allSelected ? 'Deselect all' : 'Select all' }</button>}
        { currentModus === QrAppModi.DEL_QR && <button type="button" onClick={() => deleteQrCodesHandler(selectedQrCodesForDeletion)} disabled={selectedQrCodesForDeletion.length === 0 }>Delete</button>}
        </S.GenericFooter>
      )}
    </QrCodesWrapper>
  );
};

export default QrCodesComponent;


  