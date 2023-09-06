import React, { memo, useState, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
// date-fns
import { format, getYear, getMonth, getDate, addDays, setMinutes, parse } from 'date-fns';
// styled components
import styled from 'styled-components';
// components
import EnzoCheckBoxDropdown from '../EnzoInputControls/EnzoCheckBoxDropdown';
import EnzoTimeDropDown from '../EnzoInputControls/EnzoTimeDropDown';
// contexts
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';

const AddKeyFieldTypes = {
  ADDITIONAL_ACCESS: 'ADDITIONAL_ACCESS',
  END_DATE_TIME: 'END_DATE_TIME',
  ID: 'ID',
  ROOM_ACCESS: 'ROOM_ACCESS',
  START_DATE_TIME: 'START_DATE_TIME',
};

const StyledWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.secondary,
  height: '100%',
  position: 'relative',
  width: '100%',
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
  overflowY: 'scroll',
});

const StyledControl = styled('div')(({ theme, $hasValue }) => ({
  marginTop: '8px',
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
    color: '#7A7A7A',
    pointerEvents: 'none',
    transform: $hasValue ? 'translateY(0)' : 'translateY(-53%)',
    transition: 'transform 0.05s, font-size 0.05s, top 0.05s',
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
  position: 'relative',
  display: 'grid',
  marginLeft: '30%',
  width: '70%',
  gridTemplateColumns: '45% 10% 45%',
});

const StyledColon = styled('div')({ 
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '1.35em',
  width: '100%',
})

const StyledDateInput = styled('input')({
  maxWidth: '70%',
});

const initialState = {
  initialized: false,
  key: null,
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
    case 'set-today': {
      const newKey = state.key ? { ...state.key } : {};
      newKey.startDateTime = action.payload;
      return { ...state, key: newKey };
    }
    case 'set-tomorrow': {
      const newKey = state.key ? { ...state.key } : {};
      newKey.endDateTime = action.payload;
      return { ...state, key: newKey };
    }
    default:
      console.error(`ERROR: this add key reducer action type does not exist: ${action.type}`);
      return initialState;
  }
};

const LocalAddKeyForm = ({ saveKeyClicked, selectedKey, editMode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const appDispatch = useContext(AppDispatchContext);

  const initialCheckInTime = { hours: '15', minutes: '00' };
  const initialCheckOutTime = { hours: '11', minutes: '00' };


  useEffect(()=> {
    if (editMode && selectedKey) dispatch({ type: 'set-key', payload: selectedKey });
    },[editMode, selectedKey]);
  

  const today = useMemo(() => {
    const day = new Date();
    day.setHours(Number(initialCheckInTime.hours));
    day.setMinutes(Number(initialCheckInTime.minutes));
    dispatch({ type: 'set-today', payload: day.toISOString() });
    return format(day, 'yyyy-MM-dd');
  }, [initialCheckInTime.hours, initialCheckInTime.minutes]);

  const tomorrow = useMemo(() => {
    const day = new Date();
    const dayPlusOne = addDays(day, 1);
    dayPlusOne.setHours(Number(initialCheckOutTime.hours));
    dayPlusOne.setMinutes(Number(initialCheckOutTime.minutes));
    const tomorrowISO = dayPlusOne.toISOString();
    dispatch({ type: 'set-tomorrow', payload: tomorrowISO });
    return format(dayPlusOne, 'yyyy-MM-dd');
  }, [initialCheckOutTime.hours, initialCheckOutTime.minutes]);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);


  const handleRoomInput = useCallback((value, field) => {
    dispatch({ type: 'add-rooms', field, payload: value.join(', ') });
  }, []);

  const handleArrayInput = useCallback((option, field) => {
    dispatch({ type: 'input-array-value', field: field, payload: option });
  }, []);

  const handleInput = useCallback((value, field) => {
    dispatch({ type: 'input-value', field: field, payload: value });
  }, []);

  const handleDateInput = useCallback((value, field) => {
    if (state.key) {
      const dateString = value;
      if (field.type === AddKeyFieldTypes.START_DATE_TIME) setStartDate(dateString);
      else if (field.type === AddKeyFieldTypes.END_DATE_TIME) setEndDate(dateString);
      const year = getYear(new Date(dateString));
      const month = getMonth(new Date(dateString));
      const day = getDate(new Date(dateString));

      const updatedStartDate = new Date(state.key.startDateTime);
      updatedStartDate.setFullYear(year);
      updatedStartDate.setMonth(month);
      updatedStartDate.setDate(day);
      const updatedStartDateTimeIso = updatedStartDate.toISOString();

      dispatch({ type: 'input-value', field: field, payload: updatedStartDateTimeIso });
    }
  }, [state.key, dispatch]);

  const handleStartTimeHourInput = useCallback((value, field) => {
    if (state.key) {
      const updatedStartDate = new Date(state.key.startDateTime);
      updatedStartDate.setHours(Number(value));
      const updatedStartDateTimeIso = updatedStartDate.toISOString();
      dispatch({ type: 'set-start-time', field: field, payload: updatedStartDateTimeIso });
    }
  }, [state.key, dispatch]);

  const handleStartTimeMinuteInput = useCallback((value, field) => {
    if (state.key) {
      const updatedStartDate = new Date(state.key.startDateTime);
      updatedStartDate.setMinutes(Number(value));
      const updatedStartDateTimeIso = updatedStartDate.toISOString();
      dispatch({ type: 'set-start-time', field: field, payload: updatedStartDateTimeIso });
    }
  }, [state.key, dispatch]);

  const handleEndTimeHourInput = useCallback((value, field) => {
    if (state.key) {
      const updatedEndDate = new Date(state.key.endDateTime);
      updatedEndDate.setHours(Number(value));
      const updatedEndDateTimeIso = updatedEndDate.toISOString();
      dispatch({ type: 'set-end-time', field: field, payload: updatedEndDateTimeIso });
    }
  }, [state.key, dispatch]);

  const handleEndTimeMinuteInput = useCallback((value, field) => {
    if (state.key) {
      const updatedEndDate = new Date(state.key.endDateTime);
      updatedEndDate.setMinutes(Number(value));
      const updatedEndDateTimeIso = updatedEndDate.toISOString();
      dispatch({ type: 'set-end-time', field: field, payload: updatedEndDateTimeIso });
    }
  }, [state.key, dispatch]);


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
  }, [appDispatch, fields, saveKeyClicked, state.key]);

  console.log(state);

  return (
    <StyledWrapper>
      <StyledForm>
        {fields && fields.map((field) => (
          <React.Fragment key={field.name}
          >
            {field.type === AddKeyFieldTypes.ID &&
              <StyledControl key={field.name} $hasValue={state?.key?.[field.source]?.length > 0}>
                <label>{field.name}:</label>
                <input type="text" value={state.initialized ? state.key.keyId : state?.key?.[field.source] } onChange={(e) => { handleInput(e.target.value, field); }} />
              </StyledControl>}

            {field.type === AddKeyFieldTypes.ROOM_ACCESS &&
              <StyledControl key={field.name} $hasValue={state?.key?.[field.source]?.[0].length > 0 || state.initialized}>
                <label>{field.name}:</label>
                <input type="text"
                  value={state.initialized ? state.key.data.roomAccess.join(', ') : state?.key?.[field.source] }
                  onChange={(e) => {
                    const roomNumbers = e.target.value.split(',').map((room) => room.trim());
                    handleRoomInput(roomNumbers, field);
                  }}
                />
              </StyledControl>}

            {field.type === AddKeyFieldTypes.ADDITIONAL_ACCESS &&
              <EnzoCheckBoxDropdown data={state.initialized && state.key.data.additionalAccess} field={field} label='Additional Access' options={availableAdditionalAccess} onOptionClicked={handleArrayInput} />
            }

            {field.type === AddKeyFieldTypes.START_DATE_TIME &&
              <>
                <StyledControl style={{marginTop: '15px'}}>
                  <div>Starts:</div>
                  <StyledDateInput type='date' value={startDate} onChange={(e) => { handleDateInput(e.target.value, field); }}/>
                </StyledControl>

                <StyledTimeWrapper>
                  <EnzoTimeDropDown defaultValue={initialCheckInTime.hours} label='' field={field} options={hours} onOptionClicked={handleStartTimeHourInput} />
                  <StyledColon>:</StyledColon>
                  <EnzoTimeDropDown defaultValue={initialCheckInTime.minutes} label='' options={minutes} onOptionClicked={handleStartTimeMinuteInput} />
                </StyledTimeWrapper>
              </>
            }

            {field.type === AddKeyFieldTypes.END_DATE_TIME &&
              <>
                <StyledControl >
                  <div>Ends:</div>
                  <StyledDateInput type='date' value={endDate} onChange={(e) => { handleDateInput(e.target.value, field); }} />
                </StyledControl>

                <StyledTimeWrapper>
                  <EnzoTimeDropDown defaultValue={initialCheckOutTime.hours} label='' options={hours} onOptionClicked={handleEndTimeHourInput} />
                  <StyledColon>:</StyledColon>
                  <EnzoTimeDropDown defaultValue={initialCheckOutTime.minutes} label='' options={minutes} onOptionClicked={handleEndTimeMinuteInput} />
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



