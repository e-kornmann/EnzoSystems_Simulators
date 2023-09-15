import { memo, useMemo } from 'react';
// styled-components
import styled from 'styled-components';
// date fns
import { format, parseISO } from 'date-fns';
// enums
import DeviceStatuses from '../../enums/DeviceStatuses';
// types
import KeyType from '../../types/KeyType';
// components 
import SharedLoading from '../../../local_shared/Loading';

const StyledWrapper = styled('div')({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  overflowY: 'hidden',
  padding: '0 8%',
});
const StyledHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  height: '30%',
  fontSize: '1.15em',
  fontWeight: 500,
  justifyContent: 'center',
  lineHeight: '1.23em',
  textAlign: 'center',
  whiteSpace: 'pre-line',
});
const StyledKeyBox = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  marginBottom: '15%',
  width: '100%',
  gap: '5px',
});
const StyledBoxHeader = styled('div')(({ theme }) => ({
  color: theme.colors.text.primary,
  fontSize: '0.78em',
  fontWeight: 500,
  textAlign: 'center',
  width: '100%'
}));
const StyledBoxContent = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '32% 68%',
  alignItems: 'center',
  backgroundColor: theme.colors.background.primary,
  borderRadius: '5px',
  width: '100%',
  position: 'relative',
}));
const StyledKeyId = styled('div')(({ theme }) => ({
  gridColumn: 'span 2',
  width: '100%',
  textAlign: 'center',
  fontWeight: '500',
  color: 'white',
  fontSize: '0.78em',
  backgroundColor: theme.colors.text.black,
  borderRadius: '5px 5px 0 0',
  padding: '3px',
}));
const StyledRoomNumber = styled('div')<{
  $showAddMark?: boolean
}>(({ $showAddMark }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  fontWeight: '600',
  fontVariantNumeric: 'tabular-nums',
  width: '100%',
  paddingLeft: '15%',
  '& > span': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '90%'
  },
  '&::after': {
    content: $showAddMark ? '" +"' : '" "',
    fontSize: '0.8em',
    position: 'relative',
    bottom: '6px',
  },
}));
const StyledDates = styled('div')({
  width: '100%',
  height: '40px',
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column',
  alignItems: 'flex-end',
  justifyContent: 'center',
  gap: '2px',
  paddingTop: '2px',
  paddingRight: '8%',
});
const StyledDate = styled('span')({
  fontVariantNumeric: 'tabular-nums',
  fontWeight: '500',
  fontSize: '0.78em',
  height: '12px',
});

type WaitingProps = {
  deviceStatus: DeviceStatuses,
  selectedKey: KeyType | null
};

const WaitingComponent = ({ deviceStatus, selectedKey }: WaitingProps) => {

  const title = useMemo(() => {
    switch (deviceStatus) {
      case DeviceStatuses.DISCONNECTED:
        return 'Disconnected';
      case DeviceStatuses.OUT_OF_ORDER:
        return 'Out of order';
      default:
        return 'Waiting';
    }
  }, [deviceStatus]);

  return (
    <StyledWrapper>
      <StyledHeader>
        { title === 'Waiting' ? <SharedLoading /> : title }
      </StyledHeader>

      {selectedKey &&
        <StyledKeyBox>
          <StyledBoxHeader>Available Key</StyledBoxHeader>
          <StyledBoxContent>
            <StyledKeyId>{selectedKey.keyId}</StyledKeyId>

            <StyledRoomNumber $showAddMark={selectedKey && selectedKey.roomAccess && selectedKey.roomAccess.length > 1}><span>{selectedKey && selectedKey.roomAccess && selectedKey.roomAccess[0]}</span></StyledRoomNumber>
            <StyledDates>
              <StyledDate>{format(parseISO(selectedKey.startDateTime), 'yyyy-MM-dd | HH:mm')}</StyledDate>
              <StyledDate>{format(parseISO(selectedKey.endDateTime), 'yyyy-MM-dd | HH:mm')}</StyledDate>
            </StyledDates>

          </StyledBoxContent>
        </StyledKeyBox>}
    </StyledWrapper>
  );
};

export const Waiting = memo(WaitingComponent);
