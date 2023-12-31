import styled from 'styled-components';
import { useCallback, useContext, useEffect, useState } from 'react';
import * as S from '../../local_shared/DraggableModal/ModalTemplate';
import { QrAppModi, QrCode } from '../App';
import DeleteDialog from './DeleteDialog';
import { AppContext } from '../utils/settingsReducer';
import { ReactComponent as CheckMarkIcon } from '../../local_assets/checkmark.svg';
import ts from '../Translations/translations';

const QrCodesWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: '35px',
  height: 'calc(100% - 35px)',
  width: '100%',
  borderRadius: '0 0 5px 5px',
  backgroundColor: theme.colors.background.secondary,
  display: 'grid',
  gridTemplateRows: '1fr auto',
  zIndex: '400',
}));

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
    // Check if all QRcode are selected
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
        {qrCodes.length === 0 && <NoQrCodesMessage>{ 'You don\'t have\n any QR-codes '}</NoQrCodesMessage>}
      <S.SharedStyledList>
        {qrCodes.map((qr, index) => (
          <S.SharedStyledListButton type="button" key={`${qr}_${index}`}
          onClick={() => ((currentModus === QrAppModi.DEL_QR) ? toggleSelectedQrCodeForDeletion(qr) : selectQrCodeHandler(qr))}>
            <Wrap>
              {currentModus === QrAppModi.DEL_QR && (
                <S.SharedStyledCheckBox $isSelected={selectedQrCodesForDeletion.includes(qr)}>
                  { selectedQrCodesForDeletion.includes(qr) && <CheckMarkIcon width={9} height={6}/> }
                </S.SharedStyledCheckBox>
              )}
              <span>{qr.name}</span>
            </Wrap>
            { currentModus !== QrAppModi.EDIT_LIST && currentModus !== QrAppModi.DEL_QR && currentQrCode === qr
            && <CheckMarkIcon width={14} height={11} /> }
          </S.SharedStyledListButton>
        ))}
      </S.SharedStyledList>
      {currentModus !== QrAppModi.EDIT_LIST && (
        <S.SharedStyledFooter>
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
        </S.SharedStyledFooter>
      )}
    </QrCodesWrapper>
  );
};

export default QrCodesComponent;
