import { useEffect, useState } from 'react';
import styled from 'styled-components';
// enums 
import DeviceStatuses from '../../enums/DeviceStatuses';
import { format, parseISO, addDays, setHours, setMinutes } from 'date-fns';


const StyledWrapper = styled('div')({
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflowY: 'hidden',
    padding: '20% 8%',
});

const StyledHeader = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    '& > span': {
        whiteSpace: 'pre-line',
        textAlign: 'center',
        fontSize: '1.15em',
        lineHeight: '1.23em',
        fontWeight: '500'
    }
});

const StyledAvailableKeyBox = styled('div')(({theme}) =>({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    gap: '5px',
    '& > span': {
        width: '100%',
        textAlign: 'center',
        fontWeight: '500',
        color: theme.colors.text.primary,
        fontSize: '0.78em',
    },
    '& > div': {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: '6px 6px 6px 8px',
        backgroundColor: 'white',
        borderRadius: '5px',
    }

}));

const StyledRoomNumber = styled('div')(({ $showAddMark }) => ({
    display: 'flex',
    fontWeight: '600',
    fontVariantNumeric: 'tabular-nums',
    '&::after': {
        content: $showAddMark ? '" +"' : '" "',
        fontSize: '0.85em',
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
    paddingTop: '2px',
    '& > span': {
        fontVariantNumeric: 'tabular-nums',
        fontWeight: '500',
        fontSize: '0.78em',
        height: '12px',
        textAlign: 'right',
    }
});

const InitialScreen = ({ selectedKey, deviceStatus }) => {

    const [header, setHeader] = useState("Waiting for \n command 'READ_KEY' \n or 'CREATE_KEY'");

    useEffect(()=> {
        
if (selectedKey) {
    console.log(selectedKey.startDateTime);
    console.log(selectedKey);
};
        if (deviceStatus === DeviceStatuses.DISCONNECTED) {
        setHeader('Disconnected')
        } else if ((deviceStatus === DeviceStatuses.OUT_OF_ORDER))
        setHeader('Out of order')
    }, [deviceStatus])


    return (
        <StyledWrapper>
            <StyledHeader>
               <span>{ header }</span>
            </StyledHeader>
        { selectedKey &&

        <StyledAvailableKeyBox>
            <span>Available Key</span>
            <div>
            <StyledRoomNumber $showAddMark={selectedKey.data.roomAccess.length > 1}>{selectedKey.data.roomAccess[0]}</StyledRoomNumber>
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


export default InitialScreen