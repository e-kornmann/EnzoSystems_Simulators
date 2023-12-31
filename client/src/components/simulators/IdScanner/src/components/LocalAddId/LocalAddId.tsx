import { memo, useCallback, useContext, useEffect, useReducer, Reducer, useState, useMemo } from 'react';
// styled components
import styled from 'styled-components';
// components
import { Translate } from '../../Translations/Translations';
import { DropDown } from '../EnzoInputControls/EnzoDropdown/DropDown';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
import AddIdDispatchActions from '../../types/reducerActions/AddIdDispatchActions';
// types
import InputActionType from '../../enums/InputActionTypes';
import ActionType from '../../enums/ActionTypes';
import { IdType } from '../../types/IdType';
import { Lang } from '../../App';
import { encodeInput } from '../../utils/mrcUtils';

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
  gap: '10px',
  padding: '18px 18px 18px',
  justifyItems: 'center',
  alignItems: 'center',
  overflowY: 'scroll',
});
const StyledControl = styled('div')<{
  key?: string,
  $hasValue?: boolean,
}>(({ theme, $hasValue }) => ({
  height: '35px',
  width: '100%',
  maxWidth: '400px',
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
    color: 'theme.colors.text.tertiary',
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

const StyledDateFieldsWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'grid',
  gridTemplateColumns: '1fr 28% 28%',
  columnGap: '6px',
  width: '100%',
  maxWidth: '400px',
  '& > p': {
    color: theme.colors.text.tertiary,
    margin: '2px 0 13px',
    fontWeight: '600',
    fontSize: '0.65em',
    padding: '6px 3px 0',
    gridColumn: 'span 3',
    borderTop: '0.2em solid',
    borderColor: theme.colors.buttons.lightgray,
    '& > span': {
      color: theme.colors.text.secondary,
      position: 'relative',
      top: '-0.45em',
      fontSize: '80%',
    },
  },
  '&:last-child': {
    marginBottom: '25px',
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
  [InputFields.ISSUER_CODE]: undefined,
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

const reducer: Reducer<AddIdStateType, AddIdDispatchActions> = (state, action): AddIdStateType => {
  switch (action.type) {
    case InputActionType.SET_ID: {
      return { ...state, initialized: true, iD: action.payload };
    }
    case InputActionType.INPUT_VALUE: {
      return { ...state, iD: { ...state.iD, [action.field]: action.payload } };
    }
    default:
      console.error('ERROR: this add ID reducer action type does not exist');
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
  const [dateOfBirthObject, setDateOfBirthObject] = useState<DateObjectType>({
    year: undefined, month: undefined, day: undefined, leapYear: false,
  });
  const [dateOfExpiryObject, setDateOfExpiryObject] = useState<DateObjectType>({
    year: undefined, month: undefined, day: undefined, leapYear: false,
  });

  // this useEffect updates leapYear condition
  useEffect(() => {
    const isLeapYearCalculator = (fourDigitYear: number) => (fourDigitYear % 4 === 0 && fourDigitYear % 100 !== 0) || (fourDigitYear % 400 === 0);

    // const convertTwoDigitYearToFourDigit = (twoDigitYear: number, dateOfBirth: boolean) => {
    //   const currentYear = new Date().getFullYear();
    //   const currentCentury = Math.floor(currentYear / 100);
    //   const currentTwoDigitYear = currentYear % 100;

    //   if (dateOfBirth && twoDigitYear > currentTwoDigitYear) {
    //     return (currentCentury - 1) * 100 + twoDigitYear;
    //   }
    //   return currentCentury * 100 + twoDigitYear;
    // };

    if (dateOfBirthObject.year !== undefined) {
      // const fourDigitYear = convertTwoDigitYearToFourDigit(Number(dateOfBirthObject.year), true);
      const isLeapYear = isLeapYearCalculator(Number(dateOfBirthObject.year));
      setDateOfBirthObject(prev => ({
        ...prev,
        leapYear: isLeapYear,
      }));
    }
    if (dateOfExpiryObject.year !== undefined) {
      // const fourDigitYear = convertTwoDigitYearToFourDigit(Number(dateOfExpiryObject.year), false);
      const isLeapYear = isLeapYearCalculator(Number(dateOfBirthObject.year));
      setDateOfExpiryObject(prev => ({
        ...prev,
        leapYear: isLeapYear,
      }));
    }
  }, [dateOfBirthObject.year, dateOfExpiryObject.year]);

  // this useEffect fills inputfields when in Edit mode
  useEffect(() => {
    if (editMode && currentId) {
      dispatch({ type: InputActionType.SET_ID, payload: currentId });
      if (state.iD.dateOfBirth) {
        setDateOfBirthObject(prev => ({
          ...prev,
          year: state.iD.dateOfBirth?.slice(0, 4),
          month: state.iD.dateOfBirth?.slice(4, 6),
          day: state.iD.dateOfBirth?.slice(-2),
        }));
      }
      if (state.iD.dateOfExpiry) {
        setDateOfExpiryObject(prev => ({
          ...prev,
          year: state.iD.dateOfExpiry?.slice(0, 4),
          month: state.iD.dateOfExpiry?.slice(4, 6),
          day: state.iD.dateOfExpiry?.slice(-2),
        }));
      }
    }
  }, [currentId, editMode, state.iD.dateOfBirth, state.iD.dateOfExpiry]);

  // wordt geroepen vanuit onOptionClick
  const handleInput = useCallback((payload: string, field: string) => {
    dispatch({ type: InputActionType.INPUT_VALUE, field, payload: encodeInput(payload) });
  }, []);

  // wordt geroepen vanuit onOptionClick
  const handleDateInput = useCallback((option: string, field: InputFields, dateObjectField: string | undefined) => {
    if (field === InputFields.DATE_OF_BIRTH && dateObjectField) setDateOfBirthObject(prev => ({ ...prev, [dateObjectField]: option }));
    if (field === InputFields.DATE_OF_EXPIRY && dateObjectField) setDateOfExpiryObject(prev => ({ ...prev, [dateObjectField]: option }));
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
        if (field === InputFields.DATE_OF_EXPIRY && dateOfExpiryObject.leapYear === true) {
          makeArray(29);
          break;
        }
        makeArray(28);
        break;
      default:
        break;
    }
    return numbersArray;
  }, [dateOfBirthObject.leapYear, dateOfExpiryObject.leapYear]);

  const AllInputFields = useMemo(() => Object.values(InputFields).map(field => {
    switch (field) {
      case InputFields.ISSUER_CODE:
      case InputFields.DOCUMENT_TYPE:
      case InputFields.SEX:
      case InputFields.NATIONALITY:
        return (
            <DropDown initialValue={state.iD[field]} key={field} field={field} onOptionClicked={handleInput} appLanguage={appLanguage}/>
        );
      case InputFields.DATE_OF_BIRTH:
      case InputFields.DATE_OF_EXPIRY:
        return (
            <StyledDateFieldsWrapper key={field}>
              <p><Translate id={field} language={appLanguage} />:<span>*</span></p>
              <DropDown
                initialValue={field === InputFields.DATE_OF_BIRTH
                  ? dateOfBirthObject.year
                  : dateOfExpiryObject.year}
                key={`${field}_year`}
                field={field}
                dateObjectField={'year'}
                onOptionClicked={handleDateInput}
                appLanguage={appLanguage}
              />
              <DropDown
                initialValue={field === InputFields.DATE_OF_BIRTH
                  ? dateOfBirthObject.month
                  : dateOfExpiryObject.month}
                key={`${field}_month`}
                field={field}
                dateObjectField={'month'}
                onOptionClicked={handleDateInput}
                appLanguage={appLanguage}
              />
              <DropDown
                initialValue={field === InputFields.DATE_OF_BIRTH
                  ? dateOfBirthObject.day
                  : dateOfExpiryObject.day}
                key={`${field}_day`}
                field={field}
                dateObjectField={'day'}
                onOptionClicked={handleDateInput}
                appLanguage={appLanguage}
                isDisabled={field === InputFields.DATE_OF_BIRTH
                  ? (dateOfBirthObject.year === undefined || dateOfBirthObject.month === undefined)
                  : (dateOfExpiryObject.year === undefined || dateOfExpiryObject.month === undefined)}
                amountOfDays={field === InputFields.DATE_OF_BIRTH
                  ? amountOfDays(dateOfBirthObject.month, field)
                  : amountOfDays(dateOfExpiryObject.month, field)}
              />
            </StyledDateFieldsWrapper>
        );
      default:
        return (
            <StyledControl key={field} $hasValue={state.iD && state.iD[field] !== ''}>
              <label><Translate id={field} language={appLanguage} />:<span>*</span></label>
              <input
                type="text"
                maxLength={field === InputFields.DOCUMENT_NR ? 9 : undefined}
                value={state.iD[field]}
                onChange={e => { handleInput(e.target.value, field); }} />
            </StyledControl>
        );
    }
  }), [
    amountOfDays,
    appLanguage,
    dateOfBirthObject.day,
    dateOfBirthObject.month,
    dateOfBirthObject.year,
    dateOfExpiryObject.day,
    dateOfExpiryObject.month,
    dateOfExpiryObject.year,
    handleDateInput,
    handleInput,
    state.iD]);

  useEffect(() => {
    if (saveKeyClicked) {
      if (state.iD) {
        appDispatch({
          type: editMode ? ActionType.UPDATE_ID : ActionType.SAVE_ID,
          payload: {
            ...state.iD,
            dateOfBirth: dateOfBirthObject.year && dateOfBirthObject.year + dateOfBirthObject.month + dateOfBirthObject.day,
            dateOfExpiry: dateOfExpiryObject.year && dateOfExpiryObject.year + dateOfExpiryObject.month + dateOfExpiryObject.day,
          },
        });
        // go back to initial screen when in edit mode
        if (editMode) appDispatch({ type: ActionType.CLICKED_CROSS });
      }
    }
  }, [appDispatch,
    dateOfBirthObject.day,
    dateOfBirthObject.month,
    dateOfBirthObject.year,
    dateOfExpiryObject.day,
    dateOfExpiryObject.month,
    dateOfExpiryObject.year,
    editMode,
    saveKeyClicked,
    state.iD]);

  useEffect(() => {
    const allFieldsExeptDateFieldsAreValid = Object
      .entries(state.iD)
      .every(([key, value]) => (key === InputFields.DATE_OF_BIRTH || key === InputFields.DATE_OF_EXPIRY) || (value !== '' && value !== undefined));
    const allDateOfBirthFieldsAreValid = Object
      .entries(dateOfBirthObject)
      .every(([key, value]) => value !== undefined || key === 'leapYear' as keyof DateObjectType);
    const allDateOfExpiryFieldsAreValid = Object
      .entries(dateOfExpiryObject)
      .every(([key, value]) => value !== undefined || key === 'leapYear' as keyof DateObjectType);

    if (allFieldsExeptDateFieldsAreValid && allDateOfBirthFieldsAreValid && allDateOfExpiryFieldsAreValid) {
      appDispatch({ type: ActionType.SET_SAVE_BUTTON, payload: true });
    } else {
      appDispatch({ type: ActionType.SET_SAVE_BUTTON, payload: false });
    }
  }, [appDispatch, dateOfBirthObject, dateOfExpiryObject, state.iD]);

  return (
    <StyledWrapper>
      <StyledForm>
        {AllInputFields}
      </StyledForm>
    </StyledWrapper>
  );
};

export const LocalAddId = memo(LocalAddIdComponent);
