import { memo, useCallback, useContext, useEffect, useReducer, Reducer } from 'react';
// styled components
import styled from 'styled-components';
// components
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
import AddKeyDispatchActions from '../../types/reducerActions/AddKeyDispatchActions';
// types
import InputActionType from '../../enums/InputActionTypes';
import ActionType from '../../enums/ActionTypes';
import { IdType } from '../../types/IdType';
import { Lang } from '../../App';
import { Translate } from '../../Translations/Translations';
import { SharedDropDown } from '../EnzoInputControls/EnzoDropdown/SharedDropDown';

const StyledWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.secondary,
  position: 'absolute',
  top: '35px',
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
  marginTop: '10px',
  height: '35px',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  position: 'relative',
  '& > input': {
    color: theme.colors.text.primary,
    fontSize: '1.0em',
    fontWeight: '500',
    border: '0.12em solid',
    borderColor: theme.colors.buttons.gray,
    borderRadius: '3px',
    padding: '8px 8px 8px 6px',
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
  iD: IdType;
};

export enum InputFields {
  ISSUER_CODE = 'issuerCode',
  DOCUMENT_NR = 'documentNr',
  DOCUMENT_TYPE = 'documentType',
  NAME_PRIMARY = 'primaryName',
  NAME_SECONDARY = 'secondaryeName',
  SEX = 'sex',
  NATIONALITY = 'nationality',
  DATE_OF_BIRTH = 'dateOfBirth',
  DATE_OF_EXPIRY = 'dateOfExpiry',
}

const examplePassPort: IdType = {
  [InputFields.ISSUER_CODE]: 'EXP',
  [InputFields.DOCUMENT_NR]: '5546832',
  [InputFields.DOCUMENT_TYPE]: undefined,
  [InputFields.NAME_PRIMARY]: 'Jhon',
  [InputFields.NAME_SECONDARY]: 'Doe',
  [InputFields.SEX]: undefined,
  [InputFields.NATIONALITY]: undefined,
  [InputFields.DATE_OF_BIRTH]: '830125',
  [InputFields.DATE_OF_EXPIRY]: '260525',
};

const initialState: AddIdStateType = {
  initialized: false,
  iD: examplePassPort,
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
  currentId: IdType | undefined,
  editMode: boolean,
  appLanguage: Lang;
};

const LocalAddIdComponent = ({ saveKeyClicked, currentId, editMode, appLanguage }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const appDispatch = useContext(AppDispatchContext);

  useEffect(() => {
    if (editMode && currentId) {
      dispatch({ type: InputActionType.SET_ID, payload: currentId });
    }
  }, [editMode, currentId]);

  const handleInput = useCallback((payload: string, field: keyof IdType) => {
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
    if (state.iD[InputFields.DOCUMENT_NR] !== '') {
      appDispatch({ type: ActionType.SET_SAVE_BUTTON, payload: true });
    } else {
      appDispatch({ type: ActionType.SET_SAVE_BUTTON, payload: false });
    }
  }, [appDispatch, state.iD]);

  return (
    <StyledWrapper>
      <StyledForm>
        {Object.values(InputFields).map(field => (

          (field === InputFields.DOCUMENT_TYPE || field === InputFields.SEX || field === InputFields.NATIONALITY)
            ? (
          <SharedDropDown key={field} field={field} onOptionClicked={handleInput} appLanguage={appLanguage}/>
            )
            : <StyledControl key={field} $hasValue={state.iD && state.iD[field] !== ''}>
                <label><Translate id={field} language={appLanguage} />:<span>*</span></label>
                <input
                  type="text"
                  value={state.iD[field]}
                  onChange={e => { handleInput(e.target.value, field); }} />
              </StyledControl>

        ))}
      </StyledForm>
    </StyledWrapper>
  );
};

export const LocalAddId = memo(LocalAddIdComponent);
