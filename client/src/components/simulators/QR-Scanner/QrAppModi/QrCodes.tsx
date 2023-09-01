import styled from 'styled-components';
import {
  useCallback, useContext, useEffect, useState,
} from 'react';
import * as S from '../../../shared/DraggableModal/ModalTemplate';

import * as Sv from '../../../../styles/stylevariables';
import { QrAppModi, QrCode } from '..';
import DeleteDialog from './DeleteDialog';
import { AppContext } from '../utils/settingsReducer';
import ts from '../Translations/translations';
import { SharedCheckMark } from '../../../shared/CheckAndCrossIcon';

const QrCodesWrapper = styled.div`
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

const NoQrCodesMessage = styled.div`
  width: 100%;
  height: 16%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  white-space: pre-line;
  text-align: center;
  font-size: 1.15em;
  line-height: 1.23em;
  font-weight: 500;
`;

export const Wrap = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
`;

type Props = {
  qrCodes: QrCode[];
  modusSetterHandler: (modus: QrAppModi) => void;
  selectQrCodeHandler: (selectedQrCode: QrCode) => void;
  currentModus: QrAppModi;
  currentQrCode: QrCode;
  deleteQrCodesHandler: (qrCodesToDelete: QrCode[]) => void;
};

const QrCodesComponent = ({
  qrCodes,
  modusSetterHandler,
  selectQrCodeHandler,
  currentModus,
  currentQrCode,
  deleteQrCodesHandler,
}: Props) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedQrCodesForDeletion, setSelectedQrCodesForDeletion] = useState<QrCode[]>([]);
  const [allSelected, setAllSelected] = useState(false);
  const [showQrCodes, setShowQrCodes] = useState(false);
  const { state } = useContext(AppContext);

  const toggleShowComponent = useCallback(() => {
    setShowDeleteDialog(!showDeleteDialog);
  }, [showDeleteDialog]);

  useEffect(() => {
    if (
      currentModus === QrAppModi.QR_CODES
      || currentModus === QrAppModi.EDIT_LIST
      || currentModus === QrAppModi.DEL_QR) {
      setShowQrCodes(true);
    } else {
      setShowQrCodes(false);
    }
  }, [currentModus]);

  const toggleSelectedQrCodeForDeletion = (qrCode: QrCode) => {
    if (selectedQrCodesForDeletion.includes(qrCode)) {
      setSelectedQrCodesForDeletion(selectedQrCodesForDeletion.filter(code => code !== qrCode));
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
    const areAllSchemesSelected = allQrCodes.every(qr => selectedQrCodesForDeletion.includes(qr));
    if (areAllSchemesSelected) {
      setAllSelected(true);
    } else {
      setAllSelected(false);
    }
  }, [qrCodes, selectedQrCodesForDeletion]);

  return (

    showQrCodes
    && <QrCodesWrapper>
           { qrCodes.length === 0 && <NoQrCodesMessage>{ 'You don\'t have\n any QR-codes '}</NoQrCodesMessage>}
      <S.GenericList>
        {qrCodes.map((qr, index) => (
          <S.GenericListButton type="button" key={`${qr}_${index}`}
          onClick={() => ((currentModus === QrAppModi.DEL_QR) ? toggleSelectedQrCodeForDeletion(qr) : selectQrCodeHandler(qr))}>
            <Wrap>
              {currentModus === QrAppModi.DEL_QR && (
                <S.SharedStyledCheckBox $isSelected={selectedQrCodesForDeletion.includes(qr)}>
                  <SharedCheckMark
                    isDisplayed={selectedQrCodesForDeletion.includes(qr)}
                    width={9} height={6}
                   />
                </S.SharedStyledCheckBox>
              )}
              <span>{qr.name}</span>
            </Wrap>
            { currentModus !== QrAppModi.EDIT_LIST && currentModus !== QrAppModi.DEL_QR
            && <SharedCheckMark isDisplayed={currentQrCode === qr } width={14} height={11} /> }
          </S.GenericListButton>
        ))}
      </S.GenericList>
      {currentModus !== QrAppModi.EDIT_LIST && (
        <S.GenericFooter>
        { currentModus !== QrAppModi.DEL_QR
        && <button type="button" onClick={() => modusSetterHandler(QrAppModi.NEW_QR)}>
          {ts('new', state.language)}</button> }
        { currentModus !== QrAppModi.DEL_QR
        && <button onClick={() => modusSetterHandler(QrAppModi.EDIT_LIST)} disabled={qrCodes.length === 0 }>
          {ts('edit', state.language)}</button> }
        { currentModus !== QrAppModi.DEL_QR
        && <button onClick={() => modusSetterHandler(QrAppModi.DEL_QR)} disabled={qrCodes.length === 0 }>
          {ts('delete', state.language)}</button> }
        { currentModus === QrAppModi.DEL_QR
        && <button type="button" onClick={selectOrDeselectAllHandler}>{ allSelected ? 'Deselect all' : 'Select all' }</button>}
        { currentModus === QrAppModi.DEL_QR
        && <button type="button" onClick={toggleShowComponent} disabled={selectedQrCodesForDeletion.length === 0 }>
          {ts('delete', state.language)}</button>}
        <DeleteDialog
          deleteQrCodesHandler={deleteQrCodesHandler}
          toggleShowComponent={toggleShowComponent}
          showComponent={showDeleteDialog}
          selectedQrCodesForDeletion={selectedQrCodesForDeletion} />
        </S.GenericFooter>
      )}
    </QrCodesWrapper>
  );
};

export default QrCodesComponent;
