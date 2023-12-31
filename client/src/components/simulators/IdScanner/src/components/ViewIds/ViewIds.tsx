import { memo, useCallback, useContext, useEffect, useState } from 'react';
// styled components
import styled from 'styled-components';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
// svg images
import { ReactComponent as CheckmarkIcon } from '../../../local_assets/checkmark.svg';
// types

import ActionType from '../../enums/ActionTypes';

import { IdType } from '../../types/IdType';
import { InputFields } from '../LocalAddId/LocalAddId';
import ShowIdType from '../../types/ShowIdType';

const StyledWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.secondary,
  position: 'fixed',
  top: '34px',
  left: '0',
  height: 'calc(100% - 75px)',
  width: '100%',
  padding: '2px 0',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'scroll',
  zIndex: '600',
}));
const StyledButton = styled('button')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  cursor: 'pointer',
  textAlign: 'left',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: `0.13em solid ${theme.colors.buttons.lightgray}`,
  width: '100%',
  height: '40px',
  fontSize: '0.9em',
  padding: '11px 20px 11px 11px',
  columnGap: '20px',
  '& > svg': {
    minWidth: '14px',
  },
  '& > span': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '82%',
  },
  '&:active': {
    backgroundColor: theme.colors.buttons.specialTransparent,
    fill: theme.colors.buttons.special,
  },
}));
const StyledCheckMark = styled(CheckmarkIcon)(({ theme }) => ({
  position: 'absolute',
  right: '10px',
  top: '12px',
  width: '14px',
  height: '11px',
  fill: theme.colors.buttons.special,
}));
const StyledItem = styled('div')({
  display: 'grid',
  gridTemplateColumns: '20% 80%',
  alignItems: 'center',
  columnGap: '8px',
  width: '100%',
  position: 'relative',
});
const StyledTypeOfDocument = styled('div')<{
  $showAddMark?: boolean
}>(({ $showAddMark }) => ({
  display: 'flex',
  justifyContent: 'center',
  fontWeight: '600',
  width: '100%',
  fontSize: '1.2em',
  '& > span': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    fontVariantNumeric: 'tabular-nums',
    textOverflow: 'ellipsis',
    maxWidth: '72%',
  },
  '&::after': {
    content: $showAddMark ? '" +"' : '" "',
    fontSize: '0.8em',
    position: 'relative',
    bottom: '6px',
  },
}));
const StyledInfo = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  gap: '1px',
  justifyContent: 'center',
  height: '100%',
  '& > span': {
    fontVariantNumeric: 'tabular-nums',
    fontWeight: '500',
    fontSize: '0.78em',
    height: '12px',
  },
});
const StyledWrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  columnGap: '8px',
  width: '100%',
});
const StyledSharedCheckBox = styled('div')<{
  $isSelected: boolean
}>(
  ({ $isSelected, theme }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '12px',
    height: '12px',
    border: `1px solid ${$isSelected
      ? theme.colors.buttons.special
      : theme.colors.text.primary}`,
    borderRadius: '1px',
    cursor: 'pointer',
    backgroundColor: $isSelected
      ? theme.colors.buttons.special
      : theme.colors.background.primary,
    '& > svg': {
      marginLeft: '1px',
      fill: $isSelected ? theme.colors.text.primary : 'transparent',
    },
  }),
);

type ViewIdsProps = {
  iDs: IdType[] | null,
  currentId: IdType | undefined,
  showIds: ShowIdType,
};

const ViewIdsComponent = ({ iDs, currentId, showIds }: ViewIdsProps) => {
  const { deleteIdClicked, selectAllIdsClicked, deselectAllIdsClicked, editMode, deleteMode } = showIds;
  const [currentIdsForDeletion, setSelectedIDsForDeletion] = useState<IdType[]>([]);
  const appDispatch = useContext(AppDispatchContext);

  const toggleSelectedIDForDeletion = useCallback((id: IdType) => {
    if (currentIdsForDeletion) {
      if (currentIdsForDeletion.includes(id)) {
        setSelectedIDsForDeletion(currentIdsForDeletion.filter(k => k !== id));
      } else {
        setSelectedIDsForDeletion([...currentIdsForDeletion, id]);
      }
    }
  }, [currentIdsForDeletion]);

  const handleKeySelect = useCallback((key: IdType) => {
    appDispatch({ type: ActionType.SELECT_ID, payload: key });
    if (editMode) {
      appDispatch({ type: ActionType.EDIT_ID, payload: true });
    } else if (deleteMode) {
      toggleSelectedIDForDeletion(key);
      appDispatch({ type: ActionType.SELECT_ALL_ID_CLICKED, payload: false });
      appDispatch({ type: ActionType.DESELECT_ALL_ID_CLICKED, payload: false });
    } else {
      // if not in editMode nor deleteMode go back to initialScreen
      appDispatch({ type: ActionType.CLICKED_CROSS });
    }
  }, [appDispatch, deleteMode, editMode, toggleSelectedIDForDeletion]);

  useEffect(() => {
    if (deleteIdClicked && iDs && currentIdsForDeletion) {
      const newIds = iDs.filter(k => !currentIdsForDeletion.includes(k));
      appDispatch({ type: ActionType.SET_ALL_LOCALIDS, payload: newIds });
      if (currentId && !newIds.includes(currentId)) {
        appDispatch({ type: ActionType.SELECT_ID, payload: newIds[0] });
      }
      appDispatch({ type: ActionType.CLICKED_CROSS });
    }
  }, [appDispatch, deleteIdClicked, iDs, currentId, currentIdsForDeletion]);

  useEffect(() => {
    // Check if all Keys are selected
    if (iDs && currentIdsForDeletion) {
      const allKeys = Object.values(iDs);
      const areAllSchemesSelected = allKeys.every(k => currentIdsForDeletion.includes(k));
      if (areAllSchemesSelected) {
        appDispatch({ type: ActionType.ALL_IDS_ARE_SELECTED, payload: true });
      } else {
        appDispatch({ type: ActionType.ALL_IDS_ARE_SELECTED, payload: false });
      }
    }
  }, [appDispatch, iDs, currentIdsForDeletion]);

  // this is the footer button listener
  useEffect(() => {
    if (iDs && selectAllIdsClicked) {
      setSelectedIDsForDeletion(iDs);
    }
    if (deselectAllIdsClicked) {
      setSelectedIDsForDeletion([]);
    }
  }, [iDs, deselectAllIdsClicked, selectAllIdsClicked]);

  // this useEffects Enables AND Disables the Delete button when in DeleteMode
  useEffect(() => {
    if (deleteMode && currentIdsForDeletion) {
      if (currentIdsForDeletion.length > 0) {
        appDispatch({ type: ActionType.SET_DELETE_BUTTON, payload: true });
      } else if (currentIdsForDeletion.length === 0) {
        appDispatch({ type: ActionType.SET_DELETE_BUTTON, payload: false });
      }
    }
  }, [appDispatch, deleteMode, iDs, currentIdsForDeletion]);

  return (
    <StyledWrapper>
     {iDs && iDs.map((id, index) => (
        <StyledButton key={index} type="button" onClick={() => handleKeySelect(id)}>
          <StyledItem>
            <StyledWrap>

              {deleteMode && currentIdsForDeletion
                && <StyledSharedCheckBox $isSelected={currentIdsForDeletion.includes(id)}>
                  <CheckmarkIcon width={9} height={6} />
                </StyledSharedCheckBox>
              }

              <StyledTypeOfDocument $showAddMark={false}><span>{`${id[InputFields.DOCUMENT_TYPE]}`}</span></StyledTypeOfDocument>
            </StyledWrap>
            <StyledInfo>
              <span>{id[InputFields.DOCUMENT_NR]}</span>
              <span>{` ${id[InputFields.NAME_SECONDARY]} ${id[InputFields.NAME_PRIMARY]}`}</span>
            </StyledInfo>

          </StyledItem>
          {(id === currentId && !editMode && !deleteMode) && <StyledCheckMark />}
        </StyledButton>
     ))}

    </StyledWrapper>
  );
};

export const ViewIds = memo(ViewIdsComponent);
