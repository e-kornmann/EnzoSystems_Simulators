import styled from "styled-components";
import * as S from "../../../shared/DraggableModal/ModalTemplate";
import Checkmark from "./checkmark";
import { useEffect, useState } from "react";
import * as Sv from "../../../../styles/stylevariables";
import { QrAppModi, QrCode } from "./QrCodeReader";

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

const SelectionDiv = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid black;
  cursor: pointer;
`;

type Props = {
  modusSetterHandler: () => void;
  qrCodes: QrCode[];
  selectQrCodeHandler: (selectedQrCode: QrCode) => void;
  currentModus: QrAppModi;
  currentQrCode: QrCode;
  deleteQrCodesHandler: (qrCodesToDelete: QrCode[]) => void;
};

const QrCodes = ({ modusSetterHandler, qrCodes, selectQrCodeHandler, currentModus, currentQrCode, deleteQrCodesHandler }: Props) => {
  const [selectedQrCodesForDeletion, setSelectedQrCodesForDeletion] = useState<QrCode[]>([]);
  const [allSelected, setAllSelected] = useState(false);

  const toggleSelectedQrCodeForDeletion = (qrCode: QrCode) => {
    setSelectedQrCodesForDeletion(prevSelected => {
      if (prevSelected.includes(qrCode)) {
        return prevSelected.filter(code => code !== qrCode);
      } else {
        return [...prevSelected, qrCode];
      }
    });
  };
  
  const selectOrDeselectAllHandler = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSelectedQrCodesForDeletion(_prevSelected => {
      if (allSelected) {
        return [];
      } else {
        return qrCodes;
      }
    });
  };

  useEffect(() => {
    const areAllSchemesSelected = qrCodes.every(qr => selectedQrCodesForDeletion.includes(qr));
    setAllSelected(areAllSchemesSelected);
  }, [qrCodes, selectedQrCodesForDeletion]);

  return (
    <QrCodesWrapper>
      <S.GenericList>
        {qrCodes.map((qr, index) => (
          <S.GenericListButton key={`${qr}_${index}`} onClick={() => selectQrCodeHandler(qr)}>
            <Wrap>
              {currentModus === QrAppModi.DEL_QR && (
                <SelectionDiv
                  onClick={event => {
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
            {currentModus !== QrAppModi.EDIT_LIST && currentModus !== QrAppModi.DEL_QR && <Checkmark isDisplayed={currentQrCode === qr }/> }
          </S.GenericListButton>
        ))}
      </S.GenericList>
      {currentModus !== QrAppModi.EDIT_LIST && (
        <S.GenericFooter>
          {currentModus !== QrAppModi.DEL_QR ? <button onClick={() => console.log('dsafs')}>New</button> : null}
          {currentModus !== QrAppModi.DEL_QR && <button onClick={() => modusSetterHandler()} disabled={qrCodes.length === 0 }>Edit</button>}
          {currentModus !== QrAppModi.DEL_QR && <button onClick={() => modusSetterHandler()} disabled={qrCodes.length === 0 }>Delete</button>}
          {currentModus === QrAppModi.DEL_QR && <button type="button" onClick={selectOrDeselectAllHandler}>{ allSelected ? 'Deselect all' : 'Select all' }</button>}
          {currentModus === QrAppModi.DEL_QR && <button type="button" onClick={() => deleteQrCodesHandler(selectedQrCodesForDeletion)} disabled={selectedQrCodesForDeletion.length === 0 }>Delete</button>}
        </S.GenericFooter>
      )}
    </QrCodesWrapper>
  );
};

export default QrCodes;
