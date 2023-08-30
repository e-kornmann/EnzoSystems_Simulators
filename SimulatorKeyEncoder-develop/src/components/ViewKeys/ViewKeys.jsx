import { memo, useContext } from 'react';
// styled components
import styled from 'styled-components';
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
  '&::-webkit-scrollbar': {
    background: 'transparent',
    width: '0.35rem'
  },
  '&::-webkit-scrollbar-track': {
    width: '0.35rem'
  },
  '&::-webkit-scrollbar-thumb': {
    background: theme.colors.buttons.gray,
    borderRadius: '5px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: theme.colors.buttons.asphalt,
  }
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

const ViewKeys = memo(function ViewKeys({ keys, selectedKey }) {
  const appDispatch = useContext(AppDispatchContext);

  const handleKeySelect = (key) => {
    appDispatch({ type: 'select-key', payload: key });
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
              <span>{key?.data?.startDateTime} | 16.00</span>
              <span>{key?.data?.endDateTime} | 11.00</span>
            </StyledDates>
            </StyledItem>
            { key === selectedKey && <StyledCheckMark/> }
          </StyledButton>
        ))}

    </StyledWrapper>
  );
});

export default ViewKeys;
