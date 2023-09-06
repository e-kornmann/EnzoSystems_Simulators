import { memo, useContext } from 'react';
// styled components
import styled from 'styled-components';
import { parseISO, format } from 'date-fns';
// contexts
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';
// svgs
import { ReactComponent as CheckmarkIcon } from '../../../images/success.svg';

const StyledWrapper = styled('div')(({ theme }) => ({
  padding: '2px 0',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflowY: 'scroll',
}));

const StyledButton = styled('button')(({ theme })=> ({
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
  padding: '11px',
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
    fill :theme.colors.brandColors.enzoOrange
  }
}));

const StyledCheckMark = styled(CheckmarkIcon)(({ theme })=> ({
  width: '14px',
  height: '11px',
  fill: theme.colors.brandColors.enzoOrange,
}));

const StyledItem = styled('div')({
  display: 'grid',
  gridTemplateColumns: '20% 80%',
  alignItems: 'center',
  columnGap: '8px',
  width: '100%',

});

const StyledRoomNumber = styled('div')(({ $showAddMark} ) => ({
  display: 'flex',
  fontWeight: '600',
  fontVariantNumeric: 'tabular-nums',
  '&::after': {
    content:  $showAddMark ? '" +"' : '" "', 
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

const ViewKeys = memo(function ViewKeys({ keys, selectedKey, editMode, deleteMode }) {
  const appDispatch = useContext(AppDispatchContext);

  const handleKeySelect = (key) => {
    appDispatch({ type: 'select-key', payload: key });
    if (editMode) {
      appDispatch({ type: 'edit-key', payload: true });
    } else {
      appDispatch({ type: 'clicked-cross', payload: true });
    }
  }



  console.log(selectedKey);


  return (
    <StyledWrapper>
        <StyledButton>
          <StyledItem>
          <StyledRoomNumber>
            400
          </StyledRoomNumber>
            Invalid card
          </StyledItem>
          { false && <StyledCheckMark/> }
        </StyledButton>      
        <StyledButton>
        <StyledItem>
          <StyledRoomNumber>
            410
          </StyledRoomNumber>
          Expired card
          </StyledItem>
          { false && <StyledCheckMark/> }
        </StyledButton>  

        { keys && keys.map((key) => (
          <StyledButton key={key.keyId} type="button" onClick={()=>handleKeySelect(key)}>
            <StyledItem>
            <StyledRoomNumber $showAddMark={key?.data?.roomAccess.length > 1}>{key?.data?.roomAccess[0]}</StyledRoomNumber>
            <StyledDates>
              <span>{format(parseISO(key?.data?.startDateTime), 'yyyy-MM-dd | HH:mm')}</span>
              <span>{format(parseISO(key?.data?.endDateTime), 'yyyy-MM-dd | HH:mm')}</span>
            </StyledDates>
            </StyledItem>
            { key === selectedKey && <StyledCheckMark/> }
          </StyledButton>
        ))}

    </StyledWrapper>
  );
});

export default ViewKeys;



