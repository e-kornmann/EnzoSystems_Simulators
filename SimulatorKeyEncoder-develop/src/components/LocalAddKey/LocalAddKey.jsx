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
const StyledForm = styled('div')({
  display: 'grid',
  justifyContent: 'center',
  margin: '10px 0 0 0',
  rowGap: '5px'
});
const StyledControl = styled('div')({
  columnGap: '5px',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  padding: '0 5px'
});
const StyledLabel = styled('div')({
  alignItems: 'center',
  display: 'flex'
});
const StyledInput = styled('input')({});
const StyledDateTimeInput = styled('input')({});

const initialState = {
  initialized: false,
  key: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'set-key': {
      return { ...state, initialized: true, key: action.payload };
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

const LocalAddKey = ({ saveKeyClicked }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const appDispatch = useContext(AppDispatchContext);

  const today = useMemo(() => {
    dispatch({ type: 'set-today', payload: format(new Date(), 'yyyy-MM-dd') });
    return format(new Date(), 'yyyy-MM-dd');
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

  const availableRooms = useMemo(() => {
    return [
      { name: '100', value: '100' },
      { name: '101', value: '101' },
      { name: '102', value: '102' },
      { name: '203', value: '203' },
      { name: '204', value: '204' },
      { name: '207', value: '207' },
      { name: '301', value: '301' },
      { name: '422', value: '422' },
      { name: '696', value: '696' }
    ];
  }, []);

  const availableAdditionalAccess = useMemo(() => {
    return [
      { name: 'Swimming Pool', value: 'POOL' },
      { name: 'Spa', value: 'SPA' },
      { name: 'Wellness', value: 'WELLNESS' }
    ];
  }, []);

  const handleArrayInput = useCallback((value, field) => {
    dispatch({ type: 'input-array-value', field: field, payload: [value] });
  }, []);

  const handleInput = useCallback((value, field) => {
    dispatch({ type: 'input-array-value', field: field, payload: value });
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
              <StyledControl>
                <StyledLabel>{field.name}:</StyledLabel>
                <StyledInput value={state?.key?.[field.source] || ''} onChange={(e) => { handleInput(e.target.value, field); }} />
              </StyledControl>}
            {field.type === AddKeyFieldTypes.ROOM_ACCESS &&
              <StyledControl>
                <StyledLabel>{field.name}:</StyledLabel>
                <EnzoDropdown defaultValue='' field={field} label='Room Number' options={availableRooms} onOptionClicked={handleArrayInput} />
              </StyledControl>}
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

export default memo(LocalAddKey);
