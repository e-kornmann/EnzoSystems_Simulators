import { memo } from 'react';
// styled components
import styled from 'styled-components';

const StyledWrapper = styled('div')({
  height: '100%',
  position: 'relative',
  width: '100%'
});
const StyledEmptyList = styled('div')({
  height: 'fit-content',
  width: '100%'
});
const StyledExpiredList = styled('div')({
  height: 'fit-content',
  width: '100%'
});
const StyledActiveList = styled('div')({
  height: 'fit-content',
  width: '100%'
});
const StyledHeader = styled('div')({
  height: 'fit-content',
  fontWeight: '600',
  padding: '4px 10px',
  width: '100%'
});
const StyledItem = styled('div')({
  alignItems: 'center',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  padding: '4px 10px'
});
const StyledRoomNumber = styled('div')({
  fontWeight: '600'
});
const StyledDates = styled('div')({});
const StyledDate = styled('div')({});

const ViewKeys = ({ keys }) => {
  return (
    <StyledWrapper>
      <StyledEmptyList>
        <StyledHeader>Empty cards</StyledHeader>
      </StyledEmptyList>
      <StyledExpiredList>
        <StyledHeader>Expired cards</StyledHeader>
      </StyledExpiredList>
      <StyledActiveList>
        {keys && keys.map((key) => (
          <StyledItem key={key.keyId}>
            <StyledRoomNumber>{key?.data?.roomAccess}</StyledRoomNumber>
            <StyledDates>
              <StyledDate>{key?.data?.startDateTime}</StyledDate>
              <StyledDate>{key?.data?.endDateTime}</StyledDate>
            </StyledDates>
          </StyledItem>
        ))}
      </StyledActiveList>
    </StyledWrapper>
  );
};

export default memo(ViewKeys);
