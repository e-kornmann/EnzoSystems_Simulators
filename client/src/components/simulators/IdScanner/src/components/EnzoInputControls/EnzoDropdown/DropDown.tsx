import { memo, useCallback, useEffect, useRef, useState } from 'react';
// styled components
import styled from 'styled-components';
// import StyledArrow from './EnzoCheckBoxDropDown';
import { ReactComponent as ArrowIcon } from '../../../../local_assets/arrow_up-down.svg';
// types
import { Sex, TypeOfDocument } from '../../../types/IdType';
import { CountriesAlpha3 } from '../../../enums/CountryCodesISO3166Alpha3';
import { InputFields } from '../../LocalAddId/LocalAddId';
import { Translate } from '../../../Translations/Translations';
import { Lang } from '../../../App';
import { MonthEnum } from '../../../enums/MonthEnum';

const StyledControl = styled('div')<{
  $hasValue?: boolean,
  $isDisabled?: boolean
}>(({ theme, $hasValue, $isDisabled }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  alignSelf: 'flex-start',
  position: 'relative',
  '& > label': {
    position: 'absolute',
    padding: '3px 5px',
    backgroundColor: 'white',
    borderRadius: '1px',
    fontWeight: '600',
    top: $hasValue ? '-6px' : '53%',
    left: '5px',
    fontSize: $hasValue ? '0.6em' : '0.9em',
    color: $isDisabled ? theme.colors.buttons.gray : theme.colors.text.tertiary,
    pointerEvents: 'none',
    transform: $hasValue ? 'translateY(0)' : 'translateY(-53%)',
    transition: 'transform 0.2s, font-size 0.2s, top 0.2s',
    '& > span': {
      color: theme.colors.text.secondary,
      position: 'relative',
      top: '-0.45em',
      fontSize: '80%',
    },
  },
  '&:focus-within > label': {
    top: '-5px',
    left: '5px',
    fontSize: '0.6em',
    transform: 'translateY(0)',
  },
}));
const StyledSelect = styled('div')<{
  $isFocus: boolean,
  $isDisabled?: boolean
}>(({ theme, $isFocus, $isDisabled }) => ({
  backgroundColor: theme.colors.background.primary,
  color: theme.colors.text.primary,
  fontSize: '1.0em',
  fontWeight: '500',
  border: '0.12em solid',
  borderColor: $isFocus ? theme.colors.buttons.special : theme.colors.buttons.gray,
  borderRadius: '3px',
  padding: '10px 8px 5px 6px',
  width: '100%',
  height: '35px',
  cursor: $isDisabled ? 'default' : 'pointer',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}));
const StyledArrow = styled('div')<{
  $arrowDown: boolean,
  $isDisabled?: boolean,
}>(({ theme, $arrowDown, $isDisabled }) => {
  let fill;
  if ($isDisabled) {
    fill = 'transparent';
  } else {
    fill = $arrowDown ? theme.colors.text.secondary : theme.colors.text.primary;
  }

  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '20px',
    height: '20px',
    position: 'absolute',
    right: '4px',
    top: '8px',
    transform: $arrowDown ? 'rotate(180deg)' : 'rotate(0deg)',
    pointerEvents: 'none',
    '& > svg': {
      fill,
      width: '12px',
      height: '5px',
    },
  };
});

const StyledOptionsContainer = styled('div')<{
  $showOptions: boolean
}>(({ $showOptions }) => ({
  backgroundColor: 'transparent',
  display: $showOptions ? 'flex' : 'none',
  position: 'absolute',
  flexDirection: 'column',
  top: '4px',
  width: '100%',
  zIndex: '2',
  maxHeight: '200px',
}));
const StyledClickableContainer = styled('div')({
  backgroundColor: 'transparent',
  display: 'flex',
  height: '30px',
  width: '100%',
  cursor: 'pointer',
});
const StyledOptions = styled('div')(({ theme }) => ({
  backgroundColor: 'white',
  border: `1px solid ${theme.colors.buttons.lightgray}`,
  borderRadius: '2px',
  width: '100%',
  height: 'fit-content',
  maxHeight: '120px',
  marginBottom: '50px',
  zIndex: '2',
  overflowY: 'scroll',
  overflowX: 'hidden',
}));
const StyledOption = styled('div')<{
  $isSelected: boolean,
  value: string
}>(({ theme, $isSelected }) => ({
  backgroundColor: $isSelected ? theme.colors.buttons.special : theme.colors.background.primary,
  color: $isSelected ? theme.colors.text.black : theme.colors.text.primary,
  padding: '4px 6px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.colors.buttons.specialTransparent,
  },

}));

type Props = {
  initialValue?: string | undefined;
  field: InputFields;
  dateObjectField?: string;
  onOptionClicked: (value: string, field: InputFields, dateObjectField?: string) => void;
  appLanguage: Lang;
  isDisabled?: boolean;
  isLeapYearCalculator?: (year: number, field: InputFields) => void;
  amountOfDays?: string[] | undefined;
};

const DropDownComponent = ({
  initialValue,
  field,
  dateObjectField,
  onOptionClicked,
  appLanguage,
  isDisabled,
  amountOfDays,
}: Props) => {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(undefined);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  const [options, setOptions] = useState<{ optionKeys: string[], optionValues: string[] }>({
    optionKeys: [],
    optionValues: [],
  });

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    let birthYearOptions: string[] = [''];
    let birthYearValues: string[] = [''];
    let expiryYearOptions: string[] = [''];
    let expiryYearValues: string[] = [''];

    for (let i = 0; i <= 99; i++) {
      const year = currentYear - i;
      birthYearOptions = [...birthYearOptions, year.toString()];
      birthYearValues = [...birthYearValues, year.toString().slice(-2)];
    }
    for (let i = 0; i <= 10; i++) {
      const year = currentYear + i;
      expiryYearOptions = [...expiryYearOptions, year.toString()];
      expiryYearValues = [...expiryYearValues, year.toString().slice(-2)];
    }

    switch (field) {
      case InputFields.DOCUMENT_TYPE:
        setOptions({
          optionKeys: Object.keys(TypeOfDocument) as string[],
          optionValues: Object.values(TypeOfDocument) as string[],
        });
        break;
      case InputFields.NATIONALITY:
        setOptions({
          optionKeys: Object.keys(CountriesAlpha3) as string[],
          optionValues: Object.values(CountriesAlpha3) as string[],
        });
        break;
      case InputFields.SEX:
        setOptions({
          optionKeys: Object.keys(Sex) as string[],
          optionValues: Object.values(Sex) as string[],
        });
        break;
      case InputFields.DATE_OF_BIRTH:
      case InputFields.DATE_OF_EXPIRY:
        switch (dateObjectField) {
          case 'year':
            if (field === InputFields.DATE_OF_BIRTH) setOptions({ optionKeys: birthYearOptions, optionValues: birthYearValues });
            if (field === InputFields.DATE_OF_EXPIRY) setOptions({ optionKeys: expiryYearOptions, optionValues: expiryYearValues });
            break;
          case 'month':
            setOptions({
              optionKeys: Object.keys(MonthEnum) as string[],
              optionValues: Object.values(MonthEnum) as string[],
            });
            break;
          case 'day':
            if (amountOfDays) {
              setOptions({
                optionKeys: amountOfDays,
                optionValues: amountOfDays,
              });
            }
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  }, [amountOfDays, dateObjectField, field]);

  useEffect(() => {
    if (initialValue) {
      setSelectedValue(initialValue);
    }
  }, [initialValue]);

  const handleOptionClicked = useCallback((option: string) => {
    setShowOptions(false);
    setSelectedValue(option);
    if (dateObjectField) {
      onOptionClicked(option, field, dateObjectField);
    }
    onOptionClicked(option, field);
  }, [dateObjectField, field, onOptionClicked]);

  const handleClick = useCallback(() => {
    if (!(isDisabled === true && dateObjectField === 'day')) {
      setShowOptions(prev => !prev);
    }
  }, [dateObjectField, isDisabled]);

  useEffect(() => {
    const checkIfClickedOutside = (ev: Event) => {
      if (showOptions && optionsRef.current && !optionsRef.current.contains(ev.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [showOptions]);

  return (
    <StyledControl $hasValue={selectedValue !== undefined} $isDisabled={isDisabled} ref={optionsRef} >
      <label><Translate id={dateObjectField || field} language={appLanguage} />
      {!dateObjectField && ':'}
      {!dateObjectField && <span>*</span>}
      </label>
      <StyledSelect $isFocus={showOptions} $isDisabled={isDisabled} onClick={handleClick}>
        {options.optionValues.find(option => option === selectedValue)}
      </StyledSelect>

      <StyledOptionsContainer ref={optionsRef} $showOptions={showOptions}>
        <StyledClickableContainer onClick={handleClick} />
        <StyledOptions>
  {options.optionValues.map((option, index) => (
    <StyledOption
      key={index}
      value={option}
      $isSelected={selectedValue === option}
      onClick={() => { handleOptionClicked(option); }}
    >
      {options.optionKeys[index]}
    </StyledOption>
  ))}
</StyledOptions>
      </StyledOptionsContainer>

      <StyledArrow $arrowDown={showOptions} $isDisabled={isDisabled}>
        <ArrowIcon />
      </StyledArrow>
    </StyledControl>
  );
};

export const DropDown = memo(DropDownComponent);
