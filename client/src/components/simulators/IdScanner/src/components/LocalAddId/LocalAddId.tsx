import React, { memo, useCallback, useContext, useEffect, useReducer, Reducer, useState } from 'react';
// styled components
import styled from 'styled-components';
// components
import { Translate } from '../../Translations/Translations';
import { DropDown } from '../EnzoInputControls/EnzoDropdown/DropDown';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
import AddKeyDispatchActions from '../../types/reducerActions/AddKeyDispatchActions';
// types
import InputActionType from '../../enums/InputActionTypes';
import ActionType from '../../enums/ActionTypes';
import { IdType } from '../../types/IdType';
import { Lang } from '../../App';

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
    padding: '9px 8px 7px 6px',
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
    top: $hasValue ? '-6px' : '53%',
    left: '5px',
    fontSize: $hasValue ? '0.6em' : '0.9em',
    color: '#7A7A7A',
    pointerEvents: 'none',
    transform: $hasValue ? 'translateY(0)' : 'translateY(-53%)',
    transition: 'transform 0.05s, font-size 0.05s, top 0.05s',
    '& > span': {
      color: theme.colors.text.secondary,
      position: 'relative',
      top: '-0.45em',
      fontSize: '80%',
    },
  },
  '&:focus-within > label': {
    top: '-6px',
    left: '5px',
    fontSize: '0.6em',
    transform: 'translateY(0)',
  },
}));

type AddIdStateType = {
  initialized: boolean;
  iD: IdType;
};

export enum InputFields {
  ISSUER_CODE = 'issuerCode',
  DOCUMENT_NR = 'documentNumber',
  DOCUMENT_TYPE = 'documentType',
  NAME_PRIMARY = 'namePrimary',
  NAME_SECONDARY = 'nameSecondary',
  SEX = 'sex',
  NATIONALITY = 'nationality',
  DATE_OF_BIRTH = 'dateOfBirth',
  DATE_OF_EXPIRY = 'dateOfExpiry',
}

const examplePassPort: IdType = {
  [InputFields.ISSUER_CODE]: '',
  [InputFields.DOCUMENT_NR]: '',
  [InputFields.DOCUMENT_TYPE]: undefined,
  [InputFields.NAME_PRIMARY]: '',
  [InputFields.NAME_SECONDARY]: '',
  [InputFields.SEX]: undefined,
  [InputFields.NATIONALITY]: undefined,
  [InputFields.DATE_OF_BIRTH]: undefined,
  [InputFields.DATE_OF_EXPIRY]: undefined,
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

export type DateObjectType = {
  year: string | undefined,
  month: string | undefined,
  day: string | undefined,
  leapYear: boolean,
};

const LocalAddIdComponent = ({ saveKeyClicked, currentId, editMode, appLanguage }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const appDispatch = useContext(AppDispatchContext);
  const [dateOfBirthObject, setDateOfBirthObject] = useState<DateObjectType>({ year: undefined, month: undefined, day: undefined, leapYear: false });
  const [dateOfExpiry, setDateOfExpiry] = useState<DateObjectType>({ year: undefined, month: undefined, day: undefined, leapYear: false });

  // this useEffect updates leapYear condition
  useEffect(() => {
    const isLeapYearCalculator = (fourDigitYear: number) => (fourDigitYear % 4 === 0 && fourDigitYear % 100 !== 0) || (fourDigitYear % 400 === 0);

    const convertTwoDigitYearToFourDigit = (twoDigitYear: number, dateOfBirth: boolean) => {
      const currentYear = new Date().getFullYear();
      const currentCentury = Math.floor(currentYear / 100);
      const currentTwoDigitYear = currentYear % 100;

      if (dateOfBirth && twoDigitYear >= currentTwoDigitYear) {
        return (currentCentury - 1) * 100 + twoDigitYear;
      }
      return currentCentury * 100 + twoDigitYear;
    };

    if (dateOfBirthObject.year !== undefined) {
      const fourDigitYear = convertTwoDigitYearToFourDigit(Number(dateOfBirthObject.year), true);
      const isLeapYear = isLeapYearCalculator(fourDigitYear);

      setDateOfBirthObject(prev => ({
        ...prev,
        leapYear: isLeapYear,
      }));
    }
  }, [dateOfBirthObject.year]);

  // this useEffect fills inputfields when in Edit mode
  useEffect(() => {
    if (editMode && currentId) {
      dispatch({ type: InputActionType.SET_ID, payload: currentId });
      if (state.iD.dateOfBirth) {
        setDateOfBirthObject(prev => ({
          ...prev,
          year: state.iD.dateOfBirth?.slice(2),
          month: state.iD.dateOfBirth?.slice(4, 6),
          day: state.iD.dateOfBirth?.slice(6),
        }
        ));
      }
      // nof afmaken
    }
  }, [editMode, currentId, state.iD.dateOfBirth]);

  // wordt geroepen vanuit onOptionClick
  const handleInput = useCallback((payload: string, field: string) => {
    dispatch({ type: InputActionType.INPUT_VALUE, field, payload });
  }, []);

  // wordt geroepen vanuit onOptionClick
  const handleDateInput = useCallback((option: string, field: InputFields, dateObjectField: string | undefined) => {
    if (field === InputFields.DATE_OF_BIRTH && dateObjectField) setDateOfBirthObject(prev => ({ ...prev, [dateObjectField]: option }));
    if (field === InputFields.DATE_OF_EXPIRY && dateObjectField) setDateOfExpiry(prev => ({ ...prev, [dateObjectField]: option }));
  }, []);

  const amountOfDays = useCallback((month: string | undefined, field: InputFields): string[] => {
    const numbersArray: string[] = [];

    const makeArray = (number: number) => {
      for (let i = 1; i <= number; i++) {
        const formattedNumber = i.toString().padStart(2, '0'); // Add leading zero if needed
        numbersArray.push(formattedNumber);
      }
    };
    switch (month) {
      case '01': // January
      case '03': // March
      case '05': // May
      case '07': // July
      case '08': // August
      case '10': // October
      case '12': // December
        makeArray(31);
        break;
      case '04': // April
      case '06': // June
      case '09': // September
      case '11': // November
        makeArray(30);
        break;
      case '02': // February
        if (field === InputFields.DATE_OF_BIRTH && dateOfBirthObject.leapYear === true) {
          makeArray(29);
          break;
        }
        if (field === InputFields.DATE_OF_EXPIRY && dateOfExpiry.leapYear === true) {
          makeArray(29);
          break;
        }
        makeArray(28);
        break;
      default:
        break; // Invalid month
    }
    return numbersArray;
  }, [dateOfBirthObject.leapYear, dateOfExpiry.leapYear]);

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

  console.log(state.iD);
  console.log(dateOfBirthObject);
  return (
    <StyledWrapper>
      <StyledForm>
        {Object.values(InputFields).map(field => {
          switch (field) {
            case InputFields.DOCUMENT_TYPE:
            case InputFields.SEX:
            case InputFields.NATIONALITY:
              return (
                <DropDown initialValue={state.iD[field]} key={field} field={field} onOptionClicked={handleInput} appLanguage={appLanguage}/>
              );
            case InputFields.DATE_OF_BIRTH:
            case InputFields.DATE_OF_EXPIRY:
              return (
                <React.Fragment key={field}>
                <DropDown
                  initialValue={field === InputFields.DATE_OF_BIRTH
                    ? dateOfBirthObject.year
                    : dateOfExpiry.year}
                  key={`${field}_year`}
                  field={field}
                  dateObjectField={'year'}
                  onOptionClicked={handleDateInput}
                  appLanguage={appLanguage}/>
                  <DropDown
                  initialValue={field === InputFields.DATE_OF_BIRTH
                    ? dateOfBirthObject.month
                    : dateOfExpiry.month}
                  key={`${field}_month`}
                  field={field}
                  dateObjectField={'month'}
                  onOptionClicked={handleDateInput}
                  appLanguage={appLanguage}/>
                  <DropDown
                  initialValue={field === InputFields.DATE_OF_BIRTH
                    ? dateOfBirthObject.day
                    : dateOfExpiry.day}
                  key={`${field}_day`}
                  field={field}
                  dateObjectField={'day'}
                  onOptionClicked={handleDateInput}
                  appLanguage={appLanguage}
                  isDisabled={field === InputFields.DATE_OF_BIRTH
                    ? (dateOfBirthObject.year === undefined || dateOfBirthObject.month === undefined)
                    : (dateOfExpiry.year === undefined || dateOfExpiry.month === undefined)}
                  amountOfDays={field === InputFields.DATE_OF_BIRTH
                    ? amountOfDays(dateOfBirthObject.month, field)
                    : amountOfDays(dateOfExpiry.month, field)}
                  />
                  </React.Fragment>
              );
            default:
              return (
                <StyledControl key={field} $hasValue={state.iD && state.iD[field] !== ''}>
                  <label><Translate id={field} language={appLanguage} />:<span>*</span></label>
                  <input
                    type="text"
                    value={state.iD[field]}
                    onChange={e => { handleInput(e.target.value, field); }} />
                </StyledControl>
              );
          }
        })}
      </StyledForm>
    </StyledWrapper>
  );
};

export const LocalAddId = memo(LocalAddIdComponent);
