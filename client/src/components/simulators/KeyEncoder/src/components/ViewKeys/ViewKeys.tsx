import { memo, useCallback, useContext, useEffect, useState } from 'react';
// date-fns
import { format, parseISO } from 'date-fns';
// styled components
import styled from 'styled-components';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
// svgs
import { ReactComponent as CheckmarkIcon } from '../../../images/checkmark.svg';
// types
import KeyType from '../../types/KeyType';
import ActionType from '../../enums/ActionTypes';
import ShowKeyType from '../../types/ShowKeyType';

const StyledWrapper = styled('div')({
  padding: '2px 0',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflowY: 'scroll',
});
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
  gridTemplateColumns: '30% 70%',
  alignItems: 'center',
  columnGap: '8px',
  width: '100%',
  position: 'relative',
});
const StyledRoomNumber = styled('div')<{
  $showAddMark?: boolean
}>(({ $showAddMark }) => ({
  display: 'flex',
  fontWeight: '600',
  fontVariantNumeric: 'tabular-nums',
  width: '100%',
  '& > span': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
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
const StyledDates = styled('div')({
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '29px',
  paddingBottom: '3px',
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

type ViewKeysProps = {
  keys: KeyType[] | null,
  selectedKey: KeyType | null,
  showKeys: ShowKeyType,
};

const ViewKeysComponent = ({ keys, selectedKey, showKeys }: ViewKeysProps) => {
  const { deleteKeyClicked, selectAllKeyClicked, deselectAllKeyClicked, editMode, deleteMode } = showKeys;
  const [selectedKeysForDeletion, setSelectedKeysForDeletion] = useState<KeyType[]>([]);
  const appDispatch = useContext(AppDispatchContext);

  const toggleSelectedKeyForDeletion = useCallback((key: KeyType) => {
    if (selectedKeysForDeletion) {
      if (selectedKeysForDeletion.includes(key)) {
        setSelectedKeysForDeletion(selectedKeysForDeletion.filter(k => k !== key));
      } else {
        setSelectedKeysForDeletion([...selectedKeysForDeletion, key]);
      }
    }
  }, [selectedKeysForDeletion]);

  const handleKeySelect = useCallback((key: KeyType) => {
    appDispatch({ type: ActionType.SELECT_KEY, payload: key });
    if (editMode) {
      appDispatch({ type: ActionType.EDIT_KEY, payload: true });
    } else if (deleteMode) {
      toggleSelectedKeyForDeletion(key);
      appDispatch({ type: ActionType.SELECT_ALL_KEY_CLICKED, payload: false });
      appDispatch({ type: ActionType.DESELECT_ALL_KEY_CLICKED, payload: false });
    } else {
      // if not in editMode nor deleteMode go back to initialScreen
      appDispatch({ type: ActionType.CLICKED_CROSS });
    }
  }, [appDispatch, deleteMode, editMode, toggleSelectedKeyForDeletion]);

  useEffect(() => {
    if (deleteKeyClicked && keys && selectedKeysForDeletion) {
      const newKeys = keys.filter(k => !selectedKeysForDeletion.includes(k));
      appDispatch({ type: ActionType.SET_ALL_LOCALKEYS, payload: newKeys });
      if (selectedKey && !newKeys.includes(selectedKey)) {
        appDispatch({ type: ActionType.SELECT_KEY, payload: newKeys[0] });
      }
      appDispatch({ type: ActionType.CLICKED_CROSS });
    }
  }, [appDispatch, deleteKeyClicked, keys, selectedKey, selectedKeysForDeletion]);

  useEffect(() => {
    // Check if all Keys are selected
    if (keys && selectedKeysForDeletion) {
      const allKeys = Object.values(keys);
      const areAllSchemesSelected = allKeys.every(k => selectedKeysForDeletion.includes(k));
      if (areAllSchemesSelected) {
        appDispatch({ type: ActionType.ALL_KEYS_ARE_SELECTED, payload: true });
      } else {
        appDispatch({ type: ActionType.ALL_KEYS_ARE_SELECTED, payload: false });
      }
    }
  }, [appDispatch, keys, selectedKeysForDeletion]);

  // this is the footer button listener
  useEffect(() => {
    if (keys && selectAllKeyClicked) {
      setSelectedKeysForDeletion(keys);
    }
    if (deselectAllKeyClicked) {
      setSelectedKeysForDeletion([]);
    }
  }, [keys, deselectAllKeyClicked, selectAllKeyClicked]);

  // this useEffects Enables AND Disables the Delete button when in DeleteMode
  useEffect(() => {
    if (deleteMode && selectedKeysForDeletion) {
      if (selectedKeysForDeletion.length > 0) {
        appDispatch({ type: ActionType.SET_DELETE_BUTTON, payload: true });
      } else if (selectedKeysForDeletion.length === 0) {
        appDispatch({ type: ActionType.SET_DELETE_BUTTON, payload: false });
      }
    }
  }, [appDispatch, deleteMode, keys, selectedKeysForDeletion]);

  return (
    <StyledWrapper>
      <StyledButton>
        <StyledItem>
          <StyledRoomNumber>
            400
          </StyledRoomNumber>
          Invalid card
        </StyledItem>
        {false && <StyledCheckMark />}
      </StyledButton>
      <StyledButton>
        <StyledItem>
          <StyledRoomNumber>
            410
          </StyledRoomNumber>
          Expired card
        </StyledItem>
        {false && <StyledCheckMark />}
      </StyledButton>

      {keys && keys.map((key, index) => (
        <StyledButton key={index} type="button" onClick={() => handleKeySelect(key)}>
          <StyledItem>
            <StyledWrap>

              {deleteMode && selectedKeysForDeletion
                && <StyledSharedCheckBox $isSelected={selectedKeysForDeletion.includes(key)}>
                  <CheckmarkIcon width={9} height={6} />
                </StyledSharedCheckBox>
              }

              <StyledRoomNumber $showAddMark={key?.roomAccess.length > 1}><span>{key?.roomAccess[0]}</span></StyledRoomNumber>
            </StyledWrap>
            <StyledDates>
              <span>{format(parseISO(key?.startDateTime), 'yyyy-MM-dd | HH:mm')}</span>
              <span>{format(parseISO(key?.endDateTime), 'yyyy-MM-dd | HH:mm')}</span>
            </StyledDates>

          </StyledItem>
          {(key === selectedKey && !editMode && !deleteMode) && <StyledCheckMark />}
        </StyledButton>
      ))}

    </StyledWrapper>
  );
};

export const ViewKeys = memo(ViewKeysComponent);
