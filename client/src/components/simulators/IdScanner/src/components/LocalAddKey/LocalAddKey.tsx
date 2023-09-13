import React, {
  memo, useState, useCallback, useContext, useEffect, useMemo, useReducer, Reducer,
} from 'react';
// date-fns
import {
  format, getYear, getMonth, getDate, addDays, parseISO,
} from 'date-fns';
// styled components
import styled from 'styled-components';
// components
import { EnzoCheckBoxDropDown } from '../EnzoInputControls/EnzoDropdown/EnzoCheckBoxDropdown';
import { EnzoTimeDropDown } from '../EnzoInputControls/EnzoDropdown/EnzoTimeDropDown';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
import AddKeyDispatchActions from '../../types/reducerActions/AddKeyDispatchActions';
import InputActionType from '../../enums/InputActionTypes';
// types
import KeyType from '../../types/PassPortType';
import AddKeyFieldType from '../../types/AddKeyFieldType';
import ActionType from '../../enums/ActionTypes';
import AddKeyFieldsEnum from '../../enums/AddKeyFieldsEnum';

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
const StyledControl = styled('div')<{
  key?: string,
  $hasValue?: boolean,
}>(({ theme, $hasValue }) => ({
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
      borderColor: theme.colors.buttons.special,
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
    '& > span': {
      color: theme.colors.text.secondary,
      position: 'relative',
      bottom: '3px',
    },
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
  },
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
});
const StyledDateInput = styled('input')({
  maxWidth: '70%',
});

type AddKeyStateType = {
  initialized: boolean;
  key: KeyType;
};

const initialState: AddKeyStateType = {
  initialized: false,
  key: {
    keyId: '',
    roomAccess: [''],
    additionalAccess: [''],
    startDateTime: '',
    endDateTime: '',
  },
};

const reducer: Reducer<AddKeyStateType, AddKeyDispatchActions> = (state, action): AddKeyStateType => {
  switch (action.type) {
    case InputActionType.SET_KEY: {
      return { ...state, initialized: true, key: action.payload };
    }
    case InputActionType.INPUT_ARRAY_VALUE: {
      return { ...state, key: { ...state.key, [action.field]: action.payload } };
    }
    case InputActionType.INPUT_VALUE: {
      return { ...state, key: { ...state.key, [action.field]: action.payload } };
    }
    case InputActionType.ID_VALUE: {
      return { ...state, key: { ...state.key, [action.field]: action.payload } };
    }
    case InputActionType.SET_TODAY: {
      return { ...state, key: { ...state.key, startDateTime: action.payload } };
    }
    case InputActionType.SET_TOMORROW: {
      return { ...state, key: { ...state.key, endDateTime: action.payload } };
    }
    default:
      console.error(`ERROR: this add key reducer action type does not exist: ${action.type}`);
      return initialState;
  }
};

type Props = {
  saveKeyClicked: boolean,
  selectedKey: KeyType | null,
  editMode: boolean,
};

const LocalAddKeyForm = ({ saveKeyClicked, selectedKey, editMode }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const appDispatch = useContext(AppDispatchContext);

  const initialCheckInTime = { hours: '15', minutes: '00' };
  const initialCheckOutTime = { hours: '11', minutes: '00' };

  useEffect(() => {
    if (editMode && selectedKey) {
      dispatch({ type: InputActionType.SET_KEY, payload: selectedKey });
    }
  }, [editMode, selectedKey]);

  const today = useMemo(() => {
    const day = new Date();
    day.setHours(Number(initialCheckInTime.hours));
    day.setMinutes(Number(initialCheckInTime.minutes));
    dispatch({ type: InputActionType.SET_TODAY, payload: day.toISOString() });
    return format(day, 'yyyy-MM-dd');
  }, [initialCheckInTime.hours, initialCheckInTime.minutes]);

  const tomorrow = useMemo(() => {
    const day = new Date();
    const dayPlusOne = addDays(day, 1);
    dayPlusOne.setHours(Number(initialCheckOutTime.hours));
    dayPlusOne.setMinutes(Number(initialCheckOutTime.minutes));
    const tomorrowISO = dayPlusOne.toISOString();
    dispatch({ type: InputActionType.SET_TOMORROW, payload: tomorrowISO });
    return format(dayPlusOne, 'yyyy-MM-dd');
  }, [initialCheckOutTime.hours, initialCheckOutTime.minutes]);

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);

  const handleRoomInput = useCallback((value: string, field: keyof KeyType) => {
    dispatch({ type: InputActionType.INPUT_ARRAY_VALUE, field, payload: value.split(',').map(room => room.trim()) });
  }, []);

  const handleCheckboxInput = useCallback((payload: string[], field: keyof KeyType) => {
    dispatch({ type: InputActionType.INPUT_ARRAY_VALUE, field, payload });
  }, []);

  const handleIdInput = useCallback((payload: string, field: keyof KeyType) => {
    dispatch({ type: InputActionType.ID_VALUE, field, payload });
  }, []);

  const handleDateInput = useCallback((value: string, field: keyof KeyType) => {
    if (state.key) {
      const dateString = value;
      if (field === 'startDateTime') setStartDate(dateString);
      else if (field === 'endDateTime') setEndDate(dateString);
      const year = getYear(new Date(dateString));
      const month = getMonth(new Date(dateString));
      const day = getDate(new Date(dateString));

      const updatedDate = new Date(state.key[field] as keyof KeyType);
      updatedDate.setFullYear(year);
      updatedDate.setMonth(month);
      updatedDate.setDate(day);
      const updatedDateTimeIso = updatedDate.toISOString();
      dispatch({ type: InputActionType.INPUT_VALUE, field, payload: updatedDateTimeIso });
    }
  }, [state.key, dispatch]);

  const handleHourInput = useCallback((value: string, field: keyof KeyType) => {
    if (state.key && field) {
      const updatedDate = new Date(state.key[field] as keyof KeyType);
      updatedDate.setHours(Number(value));
      const updatedDateIso = updatedDate.toISOString();
      dispatch({ type: InputActionType.INPUT_VALUE, field, payload: updatedDateIso });
    }
  }, [state.key, dispatch]);

  const handleMinuteInput = useCallback((value: string, field: keyof KeyType) => {
    if (state.key) {
      const updatedDate = new Date(state.key[field] as keyof KeyType);
      updatedDate.setMinutes(Number(value));
      const updatedDateIso = updatedDate.toISOString();
      dispatch({ type: InputActionType.INPUT_VALUE, field, payload: updatedDateIso });
    }
  }, [state.key]);

  const fields = useMemo((): AddKeyFieldType[] => [
    {
      name: 'ID',
      source: 'keyId',
      type: AddKeyFieldsEnum.ID,
    },
    {
      name: 'Room Access',
      source: 'roomAccess',
      type: AddKeyFieldsEnum.ROOM_ACCESS,
    },
    {
      name: 'Additional Access',
      source: 'additionalAccess',
      type: AddKeyFieldsEnum.ADDITIONAL_ACCESS,
    },
    {
      name: 'Start Date',
      source: 'startDateTime',
      type: AddKeyFieldsEnum.START_DATE_TIME,
    },
    {
      name: 'End Date',
      source: 'endDateTime',
      type: AddKeyFieldsEnum.END_DATE_TIME,
    },
  ], []);

  const availableAdditionalAccess = useMemo(() => [
    { name: 'Swimming Pool', value: 'POOL' },
    { name: 'Spa', value: 'SPA' },
    { name: 'Wellness', value: 'WELLNESS' },
    { name: 'Lounge', value: 'LOUNGE' },
  ], []);

  const hours = useMemo(() => [
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
  ], []);

  const minutes = useMemo(() => [
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
  ], []);

  useEffect(() => {
    if (saveKeyClicked) {
      if (editMode && state.key) {
        appDispatch({ type: ActionType.UPDATE_KEY, payload: state.key });
        // go back to initial screen.
        appDispatch({ type: ActionType.CLICKED_CROSS });
      } else {
        appDispatch({ type: ActionType.SAVE_KEY, payload: state.key });
      }
    }
  }, [appDispatch, editMode, saveKeyClicked, state.key]);

  // this useEffects Enables AND Disables the save button
  useEffect(() => {
    if (state.key.keyId !== '' && state.key.roomAccess[0] !== '') {
      appDispatch({ type: ActionType.SET_SAVE_BUTTON, payload: true });
    } else {
      appDispatch({ type: ActionType.SET_SAVE_BUTTON, payload: false });
    }
  }, [appDispatch, state.key]);

  return (
    <StyledWrapper>
      <StyledForm>
        {fields && fields.map(field => (
          <React.Fragment key={field.name}
          >
            {field.type === AddKeyFieldTypes.ID
              && <StyledControl key={field.name} $hasValue={state.key && state.key[field.source as keyof KeyType] !== ''}>
                <label>{field.name}:<span>*</span></label>
                <input
                  type="text"
                  value={state.key[field.source as keyof KeyType] as string}
                  onChange={e => { handleIdInput(e.target.value, field.source as keyof KeyType); }} />
              </StyledControl>}

            {field.type === AddKeyFieldTypes.ROOM_ACCESS
              && <StyledControl key={field.name} $hasValue={state.key && state.key[field.source as keyof KeyType][0] !== ''}>
                <label>{field.name}:<span>*</span></label>
                <input type="text"
                  value={state.key[field.source as keyof KeyType] as string}
                  onChange={e => { handleRoomInput(e.target.value, field.source as keyof KeyType); }}
                />
              </StyledControl>}

            {field.type === AddKeyFieldTypes.ADDITIONAL_ACCESS
              && <EnzoCheckBoxDropDown
                data={state.initialized ? state.key.additionalAccess : null}
                field={field}
                label={field.name}
                options={availableAdditionalAccess}
                onOptionClicked={handleCheckboxInput}
              />
            }

            {field.type === AddKeyFieldTypes.START_DATE_TIME
              && <>
                <StyledControl style={{ marginTop: '15px' }}>
                  <div>Starts:</div>
                  <StyledDateInput type='date' value={state.initialized
                    ? format(parseISO(state.key.startDateTime), 'yyyy-MM-dd')
                    : startDate} onChange={e => { handleDateInput(e.target.value, field.source as keyof KeyType); }} />
                </StyledControl>

                <StyledTimeWrapper>
                  <EnzoTimeDropDown initialValue={state.initialized
                    ? format(parseISO(state.key.startDateTime), 'HH')
                    : initialCheckInTime.hours} label='' field={field} options={hours} onOptionClicked={handleHourInput} />
                  <StyledColon>:</StyledColon>
                  <EnzoTimeDropDown initialValue={state.initialized
                    ? format(parseISO(state.key.startDateTime), 'mm')
                    : initialCheckInTime.minutes} label='' field={field} options={minutes} onOptionClicked={handleMinuteInput} />
                </StyledTimeWrapper>
              </>
            }

            {field.type === AddKeyFieldTypes.END_DATE_TIME
              && <>
                <StyledControl >
                  <div>Ends:</div>
                  <StyledDateInput type='date' value={state.initialized
                    ? format(parseISO(state.key.endDateTime), 'yyyy-MM-dd')
                    : endDate} onChange={e => { handleDateInput(e.target.value, field.source as keyof KeyType); }} />
                </StyledControl>

                <StyledTimeWrapper>
                  <EnzoTimeDropDown initialValue={state.initialized
                    ? format(parseISO(state.key.endDateTime), 'HH')
                    : initialCheckOutTime.hours} label='' field={field} options={hours} onOptionClicked={handleHourInput} />
                  <StyledColon>:</StyledColon>
                  <EnzoTimeDropDown initialValue={state.initialized
                    ? format(parseISO(state.key.endDateTime), 'mm')
                    : initialCheckOutTime.minutes} label='' field={field} options={minutes} onOptionClicked={handleMinuteInput} />
                </StyledTimeWrapper>
              </>
            }
          </React.Fragment>
        ))}
      </StyledForm>
    </StyledWrapper>
  );
};

export const LocalAddKey = memo(LocalAddKeyForm);
