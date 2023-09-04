import React, { memo, useCallback, useState, useContext, useEffect, useMemo, useReducer } from 'react';
// date-fns
import { format, addDays, addHours, addMinutes } from 'date-fns';
// styled components
import styled from 'styled-components';
// components
import EnzoDropdown from '../EnzoInputControls/EnzoDropdown';
import EnzoTimeDropdown from '../EnzoInputControls/EnzoTimeDropDown';
// contexts
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';

const AddKeyFieldTypes = {
  ADDITIONAL_ACCESS: 'ADDITIONAL_ACCESS',
  END_DATE_TIME: 'END_DATE_TIME',
  ID: 'ID',
  ROOM_ACCESS: 'ROOM_ACCESS',
  START_DATE_TIME: 'START_DATE_TIME',
};


// const StyledDropDownContainer = styled('div') ({
//   position: 'relative',
//   width: '100%',
//   height: '100%',
//   display: 'flex',
//   flexDirection: 'column',
//   justifyItems: 'flex-start',
//   alignItems: 'center',
//   height: '100%',

// });

const StyledWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.secondary,
  height: '100%',
  position: 'relative',
  width: '100%'
}));

const StyledForm = styled('form')({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 18px 18px',
  justifyItems: 'flex-start',
  alignItems: 'center',
  height: '100%',
  overflow: 'hidden'
});

const StyledControl = styled('div')(({ theme, $hasValue }) => ({
  marginTop: '12px',
  height: '35px',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  position: 'relative',
  '& > input': {
    paddingTop: '5px',
    color: theme.colors.text.primary,
    fontSize: '1.0em',
    fontWeight: '500',
    border: '0.12em solid',
    borderColor: theme.colors.buttons.gray,
    borderRadius: '3px',
    padding: '8px',
    width: '100%',
    height: '100%',
    '&:focus': {
      borderColor: theme.colors.brandColors.enzoOrange,
      outline: 'none',
    },
  },
  '& > label': {
    position: 'absolute',
    padding: '3px 5px',
    backgroundColor: 'white',
    borderRadius: '1px',
    fontWeight: '600',
    top: $hasValue ? '-5px' : '53%',
    left: '5px',
    fontSize: $hasValue ? '0.6em' : '0.9em',
    backgroundColor: 'white',
    padding: '3px 5px',
    color: '#7A7A7A',
    pointerEvents: 'none',
    transform: $hasValue ? 'translateY(0)' : 'translateY(-53%)',
    transition: 'transform 0.2s, font-size 0.2s, top 0.2s',
  },
  '&:focus-within > label': {
    top: '-5px',
    left: '5px',
    fontSize: '0.6em',
    transform: 'translateY(0)',
  },
  '& > div': {
    marginTop: '5px',
    width: '30%',
    fontSize: '0.85em',
    fontWeight: '800',
  }
}));


const StyledTimeWrapper = styled('div')({
  display: 'flex',
  marginLeft: '30%',
  width: '70%',
  gap: '10%',
  justifyContent: 'flex-start',
});


const StyledDateInput = styled('input')({

  maxWidth: '70%',
});

const initialState = {
  initialized: false,
  key: null,
  rooms: [130],
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'set-key': {
      return { ...state, initialized: true, key: action.payload };
    }
    case 'add-rooms': {
      const changedKey = state.key ? { ...state.key } : {};
      changedKey[action.field.source] = action.payload.split(',').map((room) => room.trim());
      return { ...state, key: changedKey };
    }
    case 'input-array-value': {
      const changedKey = state.key ? { ...state.key } : {};
      changedKey[action.field.source] = action.payload;
      return { ...state, key: changedKey };
    }
    case 'input-value': {
      const changedKey = state.key ? { ...state.key } : {};
      changedKey[action.field.source] = action.payload;
      return { ...state, key: changedKey };
    }
    case 'set-start-time': {
      const newKey = state.key ? { ...state.key } : {};
      newKey.startDateTime = action.payload;
      return { ...state, key: newKey };
    }
    case 'set-end-time': {
      const newKey = state.key ? { ...state.key } : {};
      newKey.endDateTime = action.payload;
      return { ...state, key: newKey };
    }
    default:
      console.error(`ERROR: this add key reducer action type does not exist: ${action.type}`);
      return initialState;
  }
};

const LocalAddKeyForm = ({ saveKeyClicked }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 1), 'yyyy-MM-dd'));

  const [startHour, setStartHour] = useState('15');
  const [startMinute, setStartMinute] = useState('00');
  const [endHour, setEndHour] = useState('11');
  const [endMinute, setEndMinute] = useState('00');


  const appDispatch = useContext(AppDispatchContext);


  const handleRoomInput = useCallback((value, field) => {
    dispatch({ type: 'add-rooms', field, payload: value.join(', ') });
  }, []);

  const handleArrayInput = useCallback((value, field) => {
    dispatch({ type: 'input-array-value', field: field, payload: [value] });
  }, []);

  const handleInput = useCallback((value, field) => {
    dispatch({ type: 'input-array-value', field: field, payload: value });
  }, []);



  const handleStartDateInput = useCallback((e) => {
    setStartDate(e.target.value);
    const formattedTime = `${startDate}'T'${startHour}:${startMinute}:${startMinute}:00`;
    dispatch({ type: 'set-start-time', payload: formattedTime });
  }, []);


  const handleStartTimeHourInput = useCallback((e) => {
    setStartHour(e.target.value);
    const formattedTime = `${startDate}'T'${startHour}:${startMinute}:${startMinute}:00`;
    dispatch({ type: 'set-start-time', payload: formattedTime });
  }, []);

  
  const handleStartTimeMinuteInput = useCallback((minute) => {
    setStartMinute(e.target.value);
    const formattedTime = `${startDate}'T'${startHour}:${startMinute}:${startMinute}:00`;
    dispatch({ type: 'set-start-time', payload: formattedTime });
  }, []);
  
  const handleEndDateInput = useCallback((e) => {
    setEndDate(e.target.value);
    const formattedTime = `${startDate}'T'${startHour}:${startMinute}:${startMinute}:00`;
    dispatch({ type: 'set-start-time', payload: formattedTime });
  }, []);


  const handleEndTimeHourInput = useCallback((hour) => {
    setEndHour(e.target.value);
    const formattedTime = `${startDate}'T'${startHour}:${startMinute}:${startMinute}:00`;
    dispatch({ type: 'set-start-time', payload: formattedTime });
  }, []);
  
  const handleEndTimeMinuteInput = useCallback((minute) => {
    setEndMinute(e.target.value);
    const formattedTime = `${startDate}'T'${startHour}:${startMinute}:${startMinute}:00`;
    dispatch({ type: 'set-start-time', payload: formattedTime });
  }, []);


  const fields = useMemo(() => {
    return [
      {
        name: 'ID',
        source: 'keyId',
        type: AddKeyFieldTypes.ID
      },
      {
        name: 'Room Access',
        source: 'roomAccess',
        type: AddKeyFieldTypes.ROOM_ACCESS
      },
      {
        name: 'Additional Access',
        source: 'additionalAccess',
        type: AddKeyFieldTypes.ADDITIONAL_ACCESS
      },
      {
        name: 'Start Date',
        source: 'startDateTime',
        type: AddKeyFieldTypes.START_DATE_TIME
      },
      {
        name: 'End Date',
        source: 'endDateTime',
        type: AddKeyFieldTypes.END_DATE_TIME
      }
    ];
  }, []);


  const availableAdditionalAccess = useMemo(() => {
    return [
      { name: 'Swimming Pool', value: 'POOL' },
      { name: 'Spa', value: 'SPA' },
      { name: 'Wellness', value: 'WELLNESS' },
      { name: 'Lounge', value: 'LOUNGE' }
    ];
  }, []);

  const hours = useMemo(() => {
    return [
      { name: '01', value: '01' },
      { name: '02', value: '02' },
      { name: '03', value: '03' },
      { name: '04', value: '04' },
      { name: '05', value: '05' },
      { name: '06', value: '06' },
      { name: '07', value: '07' },
      { name: '08', value: '08' },
      { name: '09', value: '09' },
      { name: '10', value: '10' },
      { name: '11', value: '11' },
      { name: '12', value: '12' },
      { name: '13', value: '13' },
      { name: '14', value: '14' },
      { name: '15', value: '15' },
      { name: '16', value: '16' },
      { name: '17', value: '17' },
      { name: '18', value: '18' },
      { name: '19', value: '19' },
      { name: '20', value: '20' },
      { name: '21', value: '21' },
      { name: '22', value: '22' },
      { name: '23', value: '23' },
      { name: '00', value: '00' },
    ];
  }, []);

  const minutes = useMemo(() => {
    return [
      { name: '00', value: '00' },
      { name: '05', value: '05' },
      { name: '10', value: '10' },
      { name: '15', value: '15' },
      { name: '20', value: '20' },
      { name: '25', value: '25' },
      { name: '30', value: '30' },
      { name: '35', value: '35' },
      { name: '40', value: '40' },
      { name: '45', value: '45' },
      { name: '50', value: '50' },
      { name: '55', value: '55' },
  
    ];
  }, []);


  useEffect(() => {
    if (saveKeyClicked) {
      const { keyId, ...rest } = state.key;

      const newKey = {
        keyId: keyId,
        data: { ...rest }
      };

      appDispatch({ type: 'save-key', payload: newKey });
    }
  }, [fields, saveKeyClicked, state.key]);

  return (
    <StyledWrapper>
      <StyledForm>
        {fields && fields.map((field) => (
          <React.Fragment key={field.name}
          >
            {field.type === AddKeyFieldTypes.ID &&
              <StyledControl key={field.name} $hasValue={state?.key?.[field.source]?.length > 0}>
                <label>{field.name}:</label>
                <input type="text" onChange={(e) => { handleInput(e.target.value, field); }} />
              </StyledControl>}

            {field.type === AddKeyFieldTypes.ROOM_ACCESS &&
              <StyledControl key={field.name} $hasValue={state?.key?.[field.source]?.[0].length > 0}>
                <label>{field.name}:</label>
                <input type="text"
                  value={state?.key?.[field.source]?.join(', ') || ''}
                  onChange={(e) => {
                    const roomNumbers = e.target.value.split(',').map((room) => room.trim());
                    handleRoomInput(roomNumbers, field);
                  }}
                />
              </StyledControl>}

            {field.type === AddKeyFieldTypes.ADDITIONAL_ACCESS &&
              <EnzoDropdown defaultValue={""} field={field} label='Additional Access' options={availableAdditionalAccess} onOptionClicked={handleArrayInput} />
            }

            {field.type === AddKeyFieldTypes.START_DATE_TIME &&
            <>
              <StyledControl>
                <div>Starts:</div>
                <StyledDateInput type='date' value={startDate} onChange={handleStartDateInput} />
              </StyledControl>
            
              <StyledTimeWrapper>
                <EnzoTimeDropdown defaultValue={startHour} label='' options={hours} onOptionClicked={handleStartTimeHourInput} />
                <EnzoTimeDropdown defaultValue={startMinute} label='' options={minutes} onOptionClicked={handleStartTimeMinuteInput} />
              </StyledTimeWrapper>
              </>
}
              
          
    




            {field.type === AddKeyFieldTypes.END_DATE_TIME &&
            <>
              <StyledControl >
                <div>Ends:</div>
                <StyledDateInput type='date' value={endDate} onChange={handleEndDateInput} />
              </StyledControl>
            
            <StyledTimeWrapper>
              <EnzoTimeDropdown defaultValue={endHour} label='' options={hours} onOptionClicked={handleEndTimeHourInput} />
              <EnzoTimeDropdown defaultValue={endMinute} label='' options={minutes} onOptionClicked={handleEndTimeMinuteInput} />
            </StyledTimeWrapper>
            </>
}
          </React.Fragment>
        ))}
      </StyledForm>
    </StyledWrapper>
  );
};

const LocalAddKey = memo(LocalAddKeyForm);

export default LocalAddKey;



