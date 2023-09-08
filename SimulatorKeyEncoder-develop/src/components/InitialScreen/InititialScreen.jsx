import { useEffect, useState, memo } from 'react';
// styled components
import styled from 'styled-components';
// enums 
import DeviceStatuses from '../../enums/DeviceStatuses';
// date fns
import { format, parseISO } from 'date-fns';


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
    height: '30vh',
    justifyContent: 'center',
    alignItems: 'center',
    '& > span': {
        whiteSpace: 'pre-line',
        textAlign: 'center',
        fontSize: '1.14em',
        lineHeight: '1.35em',
        fontWeight: '500'
    }
});

const StyledAvailableKeyBox = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: '10vh',
    width: '100%',
    gap: '5px',
    // text above the box
    '& > span': {
        width: '100%',
        textAlign: 'center',
        fontWeight: '500',
        color: theme.colors.text.primary,
        fontSize: '0.78em',
    },
    // the key
    '& > div': {
        display: 'grid',
        gridTemplateColumns: '32% 68%',
        alignItems: 'center',
        backgroundColor: theme.colors.background.primary,
        borderRadius: '5px',
        width: '100%',
        position: 'relative',
     
        '& > span': {
            gridColumn: 'span 2',
            width: '100%',
            textAlign: 'center',
            fontWeight: '500',
            color: 'white',
            fontSize: '0.78em',
            backgroundColor: theme.colors.text.black,
            borderRadius: '5px 5px 0 0',
            padding: '3px',
        },
    }
}));

const StyledRoomNumber = styled('div')(({ $showAddMark }) => ({
    display: 'flex',
    justifyContent: 'center',
    fontWeight: '600',

    fontVariantNumeric: 'tabular-nums',
    width: '100%',
    paddingLeft: '5px',
    '& > span': {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        maxWidth: '100%'
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
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
    paddingTop: '2px',
    '& > span': {
        fontVariantNumeric: 'tabular-nums',
        fontWeight: '500',
        fontSize: '0.78em',
        height: '12px',
    }
});

const WaitingScreen = ({ selectedKey, deviceStatus }) => {
    const [header, setHeader] = useState("Waiting for \n command 'READ_KEY' \n or 'CREATE_KEY'");

    useEffect(() => {
        if (selectedKey) {
            console.log(selectedKey.startDateTime);
            console.log(selectedKey);
        }
        if (deviceStatus === DeviceStatuses.DISCONNECTED) {
            setHeader('Disconnected')
        } else if ((deviceStatus === DeviceStatuses.OUT_OF_ORDER))
            setHeader('Out of order')
    }, [deviceStatus, selectedKey])

    return (
        <StyledWrapper>
            <StyledHeader>
                <span>{header}</span>
            </StyledHeader>
            {selectedKey &&
                <StyledAvailableKeyBox>
                    <span>Available Key</span>
                    <div>
                    <span>{selectedKey.keyId}</span>
                        <StyledRoomNumber $showAddMark={selectedKey.data.roomAccess.length > 1}><span>{selectedKey.data.roomAccess[0]}</span></StyledRoomNumber>
                        <StyledDates>
                            <span>{format(parseISO(selectedKey.data.startDateTime), 'yyyy-MM-dd | HH:mm')}</span>
                            <span>{format(parseISO(selectedKey.data.endDateTime), 'yyyy-MM-dd | HH:mm')}</span>
                        </StyledDates>
                    </div>
                </StyledAvailableKeyBox>
            }
        </StyledWrapper>
    )
}

const InitialScreen = memo(WaitingScreen);

export default InitialScreen