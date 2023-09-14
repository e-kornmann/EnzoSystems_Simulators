import React, { memo, useCallback, useContext, useEffect, useMemo, useReducer, Reducer } from 'react';
// styled components
import styled from 'styled-components';
// components
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
import AddKeyDispatchActions from '../../local_types/reducerActions/AddKeyDispatchActions';
import InputActionType from '../../enums/InputActionTypes';
// types

import AddKeyFieldType from '../../local_types/AddKeyFieldType';
import ActionType from '../../enums/ActionTypes';
import AddKeyFieldsEnum from '../../enums/AddKeyFieldsEnum';
import { PassPort, PassportDocument, TypeOfDocument, translate } from '../../types/PassPortType';
import { Country } from '../../enums/CountryCodesEnum';

const AddKeyFieldTypes = {
  ADDITIONAL_ACCESS: 'ADDITIONAL_ACCESS',
  END_DATE_TIME: 'END_DATE_TIME',
  ID: 'ID',
  ROOM_ACCESS: 'ROOM_ACCESS',
  START_DATE_TIME: 'START_DATE_TIME',
};
const StyledWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.secondary,
  position: 'absolute',
  top: '34px',
  left: '0',
  height: 'calc(100% - 75px)',
  width: '100%',
  zIndex: '600',
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
// const StyledTimeWrapper = styled('div')({
//   position: 'relative',
//   display: 'grid',
//   marginLeft: '30%',
//   width: '70%',
//   gridTemplateColumns: '45% 10% 45%',
// });
// const StyledColon = styled('div')({
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   fontSize: '1.35em',
//   width: '100%',
// });
// const StyledDateInput = styled('input')({
//   maxWidth: '70%',
// });

type AddIdStateType = {
  initialized: boolean;
  iD: PassPort;
};

const initialState: AddIdStateType = {
  initialized: false,
  iD: {
    issuingOrganization: 'Example Org',
    document: PassportDocument.ENGLISH,
    documentCode: TypeOfDocument.Passport,
    issuingOrganizationCode: 'ABC',
    passPortNr: '67890',
    name: 'John Doe',
    primaryId: '',
    secondaryId: 'ID456',
    nationality: Country.UnitedStates,
    dateOfBirth: 'yyyy-mm-dd',
    personalNumber: '123456789',
    sex: translate.male.ENGLISH,
    placeOfBirth: 'Boston',
    dateOfIssue: '2001-05-14',
    dateOfExpiry: '2001-05-14',
  },
};

const reducer: Reducer<AddIdStateType, AddKeyDispatchActions> = (state, action): AddIdStateType => {
  switch (action.type) {
    case InputActionType.SET_ID: {
      return { ...state, initialized: true, iD: action.payload };
    }
    case InputActionType.INPUT_VALUE: {
      return { ...state, iD: { ...state.iD, [action.field]: action.payload } };
    }
    default:
      console.error(`ERROR: this add key reducer action type does not exist: ${action.type}`);
      return initialState;
  }
};

type Props = {
  saveKeyClicked: boolean,
  currentId: PassPort | undefined,
  editMode: boolean,
};

const LocalAddIdComponent = ({ saveKeyClicked, currentId, editMode }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const appDispatch = useContext(AppDispatchContext);

  useEffect(() => {
    if (editMode && currentId) {
      dispatch({ type: InputActionType.SET_ID, payload: currentId });
    }
  }, [editMode, currentId]);

  const handleInput = useCallback((payload: string, field: keyof PassPort) => {
    dispatch({ type: InputActionType.INPUT_VALUE, field, payload });
  }, []);

  // const handleDateInput = useCallback((value: string, field: keyof PassPort) => {
  //   if (state.iD) {
  //     const dateString = value;
  //     const year = getYear(new Date(dateString));
  //     const month = getMonth(new Date(dateString));
  //     const day = getDate(new Date(dateString));

  //     const updatedDate = new Date(state.iD[field] as keyof PassPort);
  //     updatedDate.setFullYear(year);
  //     updatedDate.setMonth(month);
  //     updatedDate.setDate(day);
  //     const updatedDateTimeIso = updatedDate.toISOString();
  //     dispatch({ type: InputActionType.INPUT_VALUE, field, payload: updatedDateTimeIso });
  //   }
  // }, [state.iD, dispatch]);

  const fields = useMemo((): AddKeyFieldType[] => [
    {
      name: 'ID',
      source: 'primaryId',
      type: AddKeyFieldsEnum.ID,
    },

  ], []);

  useEffect(() => {
    if (saveKeyClicked) {
      if (editMode && state.iD) {
        appDispatch({ type: ActionType.UPDATE_ID, payload: state.iD });
        // go back to initial screen.
        appDispatch({ type: ActionType.CLICKED_CROSS });
      } else {
        appDispatch({ type: ActionType.SAVE_ID, payload: state.iD });
      }
    }
  }, [appDispatch, editMode, saveKeyClicked, state.iD]);

  // this useEffects Enables AND Disables the save button
  useEffect(() => {
    if (state.iD.primaryId !== '') {
      appDispatch({ type: ActionType.SET_SAVE_BUTTON, payload: true });
    } else {
      appDispatch({ type: ActionType.SET_SAVE_BUTTON, payload: false });
    }
  }, [appDispatch, state.iD]);

  return (
    <StyledWrapper>
      <StyledForm>
        {fields && fields.map(field => (
          <React.Fragment key={field.name}
          >
            {field.type === AddKeyFieldTypes.ID
              && <StyledControl key={field.name} $hasValue={state.iD && state.iD[field.source as keyof PassPort] !== ''}>
                <label>{field.name}:<span>*</span></label>
                <input
                  type="text"
                  value={state.iD[field.source as keyof PassPort] as string}
                  onChange={e => { handleInput(e.target.value, field.source as keyof PassPort); }} />
              </StyledControl>}
          </React.Fragment>
        ))}
      </StyledForm>
    </StyledWrapper>
  );
};

export const LocalAddId = memo(LocalAddIdComponent);
