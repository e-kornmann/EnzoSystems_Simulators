import { memo, useContext, useState, useEffect, useCallback } from 'react';
// styled components
import styled from 'styled-components';
import { parseISO, format } from 'date-fns';
// contexts
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';
// svgs
import { ReactComponent as CheckmarkIcon } from '../../../images/success.svg';

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
  borderBottom: '0.13em solid ' + theme.colors.buttons.lightgray,
  width: '100%',
  height: '40px',
  fontSize: '0.9em',
  padding: '11px 20px 11px 11px',
  columnGap: '20px',
  '& > svg': {
    minWidth: '14px'
  },
  '& > span': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '82%'
  },
  '&:active': {
    backgroundColor: theme.colors.brandColors.enzoLightOrange,
    fill: theme.colors.brandColors.enzoOrange
  }
}));

const StyledCheckMark = styled(CheckmarkIcon)(({ theme }) => ({
  position: 'absolute',
  right: '10px',
  top: '12px',
  width: '14px',
  height: '11px',
  fill: theme.colors.brandColors.enzoOrange,
}));

const StyledItem = styled('div')({
  display: 'grid',
  gridTemplateColumns: '30% 70%',
  alignItems: 'center',
  columnGap: '8px',
  width: '100%',
  position: 'relative',

});

const StyledRoomNumber = styled('div')(({ $showAddMark }) => ({
  display: 'flex',
  fontWeight: '600',
  fontVariantNumeric: 'tabular-nums',
  width: '100%',
  '& > span': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '72%'
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
  }
});

const Wrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  columnGap: '8px',
  width: '100%',
});

const SharedStyledCheckBox = styled('div')(
  ({ $isSelected, theme }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '12px',
    height: '12px',
    border: `1px solid ${$isSelected
      ? theme.colors.brandColors.enzoOrange
      : theme.colors.text.primary}`,
    borderRadius: '1px',
    cursor: 'pointer',
    backgroundColor: $isSelected
      ? theme.colors.brandColors.enzoOrange
      : theme.colors.background.primary,
    '& > svg': {
      marginLeft: '1px',
      fill: $isSelected ? theme.colors.text.primary : 'transparent',
    },
  }),
);


const ViewKeys = memo(function ViewKeys({ keys, selectedKey, showKeys }) {
  const { deleteKeyClicked, selectAllKeyClicked, deselectAllKeyClicked, editMode, deleteMode } = showKeys;
  const [selectedKeysForDeletion, setSelectedKeysForDeletion] = useState([]);
  const appDispatch = useContext(AppDispatchContext);

  const toggleSelectedKeyForDeletion = useCallback((key) => {
    if (selectedKeysForDeletion.includes(key)) {
      setSelectedKeysForDeletion(selectedKeysForDeletion.filter(selectedKey => selectedKey !== key));
    } else {
      setSelectedKeysForDeletion([...selectedKeysForDeletion, key]);
    }
  }, [selectedKeysForDeletion]);

  const handleKeySelect = useCallback((key) => {
    appDispatch({ type: 'select-key', payload: key });
    if (editMode) {
      appDispatch({ type: 'edit-key', payload: true });
    } else if (deleteMode) {
      toggleSelectedKeyForDeletion(key);
      appDispatch({ type: 'select-all-key-clicked', payload: false});
      appDispatch({ type: 'deselect-all-key-clicked', payload: false});
    } else {
      // if not in editMode nor deleteMode go back to initialScreen
      appDispatch({ type: 'clicked-cross' });
    }
  },[appDispatch, deleteMode, editMode, toggleSelectedKeyForDeletion])
  
  useEffect(() => {
    if (deleteKeyClicked) {
      const newKeys = keys.filter(k => !selectedKeysForDeletion.includes(k))
      appDispatch({ type: 'new-key-set-after-deletion', payload: newKeys });

      if (!newKeys.includes(selectedKey)) {
        appDispatch({ type: 'select-key', payload: newKeys[0] });
      }
      appDispatch({ type: 'clicked-cross' });

    }
  }, [appDispatch, deleteKeyClicked, keys, selectedKey, selectedKeysForDeletion]);


  
  useEffect(() => {
    // Check if all Keys are selected
    if (keys) {
      const allKeys = Object.values(keys);
      const areAllSchemesSelected = allKeys.every(k => selectedKeysForDeletion.includes(k));
      if (areAllSchemesSelected) {
        appDispatch({ type: 'all-keys-are-selected', payload: true });
      } else {
        appDispatch({ type: 'all-keys-are-selected', payload: false });
      }
    }
  }, [appDispatch, keys, selectedKeysForDeletion]);


  // this is the footer button listener
  useEffect(() => {
    if (selectAllKeyClicked) {
      setSelectedKeysForDeletion(keys);
    }
    if (deselectAllKeyClicked) {
      setSelectedKeysForDeletion([]);
    }
  }, [keys, deselectAllKeyClicked, selectAllKeyClicked]);




  // this useEffects Enables AND Disables the Delete button when in DeleteMode  
  useEffect(() => {
    if (deleteMode) {
      if (selectedKeysForDeletion.length > 0) {
        appDispatch({ type: 'set-delete-button', payload: true });
      } else if (selectedKeysForDeletion.length === 0) {
        appDispatch({ type: 'set-delete-button', payload: false });
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

      {keys && keys.map((key) => (
        <StyledButton key={key.keyId} type="button" onClick={() => handleKeySelect(key)}>
          <StyledItem>
          <Wrap>

            {deleteMode &&
                <SharedStyledCheckBox $isSelected={selectedKeysForDeletion.includes(key)}>
                  <CheckmarkIcon width={9} height={6} />
                </SharedStyledCheckBox>
            }

            <StyledRoomNumber $showAddMark={key?.data?.roomAccess.length > 1}><span>{key?.data?.roomAccess[0]}</span></StyledRoomNumber>
            </Wrap>
            <StyledDates>
              <span>{format(parseISO(key?.data?.startDateTime), 'yyyy-MM-dd | HH:mm')}</span>
              <span>{format(parseISO(key?.data?.endDateTime), 'yyyy-MM-dd | HH:mm')}</span>
            </StyledDates>
     
          </StyledItem>
          {(key === selectedKey && !editMode && !deleteMode) &&<StyledCheckMark />}
        </StyledButton>
      ))}

    </StyledWrapper>
  );
});

export default ViewKeys;



