import { memo, useCallback, useEffect, useRef, useState } from 'react';
// styled components
import styled from 'styled-components';
// import StyledArrow from './EnzoCheckBoxDropDown';
import { ReactComponent as ArrowIcon } from '../../../../images/arrow_up-down.svg';
// types
import AddKeyFieldType from '../../../types/AddKeyFieldType';
import KeyType from '../../../types/KeyType';

const StyledControl = styled('div')<{
  $hasValue?: boolean
}>(({ theme, $hasValue }) => ({
  height: '35px',
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  justifyContent: 'flex-start',
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
    color: theme.colors.text.tertiary,
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
  $isFocus: boolean
}>(({ theme, $isFocus }) => ({
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
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}));
const StyledArrow = styled('div')<{
  $arrowDown: boolean
}>(({ theme, $arrowDown }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '20px',
  height: '20px',
  position: 'absolute',
  right: '4px',
  top: '8px',
  transform: $arrowDown ? 'rotate(180deg)' : 'rotate(0deg)',
  '& > svg': {
    fill: $arrowDown ? theme.colors.text.secondary : theme.colors.text.primary,
    width: '12px',
    height: '5px',
  },
  pointerEvents: 'none',
}));

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

type Option = {
  name: string,
  value: string
};

type Props = {
  initialValue: string,
  field: AddKeyFieldType,
  label: string,
  options: Option[],
  onOptionClicked: (value: string, field: keyof KeyType) => void
};

const TimeDropDown = ({
  initialValue, field, label, options, onOptionClicked,
}: Props) => {
  const [selectedValue, setSelectedValue] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialValue) {
      setSelectedValue(initialValue);
    }
  }, [initialValue]);

  const handleOptionClicked = useCallback((option: Option) => {
    setShowOptions(false);
    setSelectedValue(option.value);
    onOptionClicked(option.value, field.source as keyof KeyType);
  }, [field, onOptionClicked]);

  const handleClick = useCallback(() => {
    setShowOptions(prev => !prev);
  }, []);

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
    <StyledControl>
      <StyledSelect $isFocus={showOptions} onClick={handleClick}>
        {options?.find(option => option.value === selectedValue)?.name || label}
      </StyledSelect>

      <StyledOptionsContainer ref={optionsRef} $showOptions={showOptions}>
        <StyledClickableContainer onClick={handleClick} />
        <StyledOptions>
          {options.map(option => (
            <StyledOption
              key={option.name}
              value={option.value}
              $isSelected={selectedValue === option.value}
              onClick={() => { handleOptionClicked(option); }}>
              {option.name}
            </StyledOption>
          ))}
        </StyledOptions>
      </StyledOptionsContainer>

      <StyledArrow $arrowDown={showOptions}>
        <ArrowIcon />
      </StyledArrow>
    </StyledControl>
  );
};

export const EnzoTimeDropDown = memo(TimeDropDown);
