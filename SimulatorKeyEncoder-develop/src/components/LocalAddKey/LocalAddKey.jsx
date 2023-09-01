import React, { memo, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
// date-fns
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
// styled components
import styled from 'styled-components';
// components
import EnzoDropdown from '../EnzoInputControls/EnzoDropdown';
// contexts
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';

const AddKeyFieldTypes = {
  ADDITIONAL_ACCESS: 'ADDITIONAL_ACCESS',
  END_DATE_TIME: 'END_DATE_TIME',
  ID: 'ID',
  ROOM_ACCESS: 'ROOM_ACCESS',
  START_DATE_TIME: 'START_DATE_TIME'
};

const StyledWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.secondary,
  height: '100%',
  position: 'relative',
  width: '100%'
}));

const StyledForm = styled('form')({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid pink',
  padding: '5px 18px 18px',
  justifyItems: 'flex-start',
  alignItems: 'center',
  height: '100%',
  overflow: 'hidden'
});

const StyledControl = styled('div')(({ theme, $hasValue }) => ({
  marginTop: '18px',
  height: '40px',
  width: '100%',
  position: 'relative', 
  '& > label': {
    transform: $hasValue ? 'translate(1px, -16px) scale(0.75)' : 'none',
  },
  '&:focus-within > label': {
    transform: 'translate(0px, -16px) scale(0.75)',
  },
}));

const StyledLabel = styled('label')(({ theme, $animate }) => ({
  position: 'absolute', 
  top: '6px',
  left: '2px',
  padding: '3px 5px',
  backgroundColor: 'white',
  borderRadius: '1px',
  fontWeight: '600',
  fontSize: '0.9em',
  color: '#7A7A7A',
  transition: 'font-size 0.2s, transform 0.2s',
  pointerEvents: 'none',
  '& > span': {
    color: theme.colors.text.secondary,
  },
}));

const StyledInput = styled('input')(({ theme }) => ({
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
}));

const StyledDateTimeInput = styled('input')({});

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
    case 'add-room': {
      const newRooms = [...state.rooms, '']; // Add a new empty room
      return {
        ...state,
        rooms: newRooms,
      };
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

const LocalAddKeyForm = ({ saveKeyClicked }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const appDispatch = useContext(AppDispatchContext);

  const today = useMemo(() => {
    dispatch({ type: 'set-today', payload: format(new Date(), 'yyyy-MM-dd') });
    return format(new Date(), 'yyyy-MM-dd');
  }, []);

  
  const addRoom = () => {
    dispatch({ type: 'add-room' });
  };

  const handleRoomInput = (event, index) => {
    const newRooms = [...state.rooms];
    newRooms[index] = event.target.value;
    dispatch({ type: 'input-array-value', field: fields.find(f => f.type === AddKeyFieldTypes.ROOM_ACCESS), payload: newRooms });
  };

  const removeRoom = (index) => {
    const newRooms = [...state.rooms];
    newRooms.splice(index, 1);
    dispatch({ type: 'input-array-value', field: fields.find(f => f.type === AddKeyFieldTypes.ROOM_ACCESS), payload: newRooms });
  };

    const handleArrayInput = useCallback((value, field) => {
    dispatch({ type: 'input-array-value', field: field, payload: [value] });
  }, []);

  const handleInput = useCallback((value, field) => {
    dispatch({ type: 'input-array-value', field: field, payload: value });
  }, []);



  const tomorrow = useMemo(() => {
    dispatch({ type: 'set-tomorrow', payload: format(addDays(new Date(), 1), 'yyyy-MM-dd') });
    return format(addDays(new Date(), 1), 'yyyy-MM-dd');
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
      { name: 'Wellness', value: 'WELLNESS' }
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
          <React.Fragment key={field.name}>
            {field.type === AddKeyFieldTypes.ID &&
              <StyledControl $hasValue={state?.key?.[field.source]?.length > 0}> 
                <StyledLabel>{field.name}:</StyledLabel>
                <StyledInput onChange={(e) => { handleInput(e.target.value, field); }} />
              </StyledControl>}
            {field.type === AddKeyFieldTypes.ROOM_ACCESS && 
             
             <>
             {state.rooms.map((room, index) => (
               <StyledControl key={index}>
                 <StyledLabel>{field.name + index}:</StyledLabel>
                 <StyledInput
                   value={room}
                   onChange={(e) => handleRoomInput(e, index)} // Pass the index to identify the room
                 />
                 <button onClick={() => removeRoom(index)}>Remove</button>
               </StyledControl>
             ))}
             <div onClick={() => addRoom()}>Add new room</div>
           </>
    
}
            {field.type === AddKeyFieldTypes.ADDITIONAL_ACCESS &&
              <StyledControl>
                <StyledLabel>{field.name}:</StyledLabel>
                <EnzoDropdown defaultValue='' field={field} label='Additional Access' options={availableAdditionalAccess} onOptionClicked={handleArrayInput} />
              </StyledControl>}
            {field.type === AddKeyFieldTypes.START_DATE_TIME &&
              <StyledControl>
                <StyledLabel>{field.name}:</StyledLabel>
                <StyledDateTimeInput type='date' value={state?.key?.[field.source] || today} onChange={(e) => { handleInput(e.target.value, field); }} />
              </StyledControl>}
            {field.type === AddKeyFieldTypes.END_DATE_TIME &&
              <StyledControl>
                <StyledLabel>{field.name}:</StyledLabel>
                <StyledDateTimeInput type='date' value={state?.key?.[field.source] || tomorrow} onChange={(e) => { handleInput(e.target.value, field); }} />
              </StyledControl>}
          </React.Fragment>
        ))}
      </StyledForm>
    </StyledWrapper>
  );
};

const LocalAddKey = memo(LocalAddKeyForm)

export default LocalAddKey
