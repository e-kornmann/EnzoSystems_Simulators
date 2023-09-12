import { memo, useCallback, useEffect, useRef, useState } from 'react';
// styled components
import styled from 'styled-components';
// import StyledArrow from './EnzoCheckBoxDropDown';
import { ReactComponent as ArrowIcon } from '../../../../images/arrow_up-down.svg';
// types
import AddKeyFieldType from '../../../types/AddKeyFieldType';
import { KeyData } from '../../../types/KeyType';

const StyledControl = styled('div')<{
  $hasValue?: boolean
}>(({ $hasValue }) => ({
  marginTop: '4px',
  height: '34px',
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
    top: $hasValue ? '-5px' : '50%',
    left: '5px',
    fontSize: $hasValue ? '0.6em' : '0.9em',
    color: '#7A7A7A',
    pointerEvents: 'none',
    transform: $hasValue ? 'translateY(0)' : 'translateY(-50%)',
    transition: 'transform 0.2s, font-size 0.2s, top 0.2s',
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
  borderColor: $isFocus ? theme.colors.brandColors.enzoOrange : theme.colors.buttons.gray,
  borderRadius: '3px',
  padding: '9px 8px 0px',
  width: '100%',
  height: '100%',
  cursor: 'pointer',
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
  right: '5px',
  top: '8px',
  transform: $arrowDown ? 'rotate(180deg)' : 'rotate(0deg)',
  '& > svg': {
    fill: $arrowDown ? theme.colors.text.secondary : theme.colors.text.primary,
    width: '13px',
    height: '6px'
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
  top: '14px',
  width: '100%',
  zIndex: '2',
  height: '100px',
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
  height: '100%',
  marginBottom: '10px',
  zIndex: '2',
  overflowY: 'scroll',
  overflowX: 'hidden',
}));

const StyledOption = styled('div')<{
  $isSelected: boolean,
  value: string
}>(({ theme, $isSelected }) => ({
  backgroundColor: $isSelected ? theme.colors.brandColors.enzoOrange : theme.colors.background.primary,
  color: $isSelected ? theme.colors.text.black : theme.colors.text.primary,
  padding: '3px 9px',
  cursor: 'pointer',
  '&:first-child': {
    padding: '7px 9px 3px',
  },
  '&:last-child': {
    padding: '3px 9px 7px',
  }
})
);


type Option = {
  name: string,
  value: string
};

type Props = {
  initialValue: string,
  field: AddKeyFieldType,
  label: string,
  options: Option[],
  onOptionClicked: (value: string, field: keyof KeyData) => void
};

const TimeDropDown = ({ initialValue, field, label, options, onOptionClicked }: Props) => {
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
    onOptionClicked(option.value, field.source as keyof KeyData);
  }, [field, onOptionClicked]);

  const handleClick = useCallback(() => {
    setShowOptions((prev) => !prev);
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
        {options?.find((option) => option.value === selectedValue)?.name || label}
      </StyledSelect>

      <StyledOptionsContainer ref={optionsRef} $showOptions={showOptions}>
        <StyledClickableContainer onClick={handleClick} />
        <StyledOptions>
          {options.map((option) => (
            <StyledOption
              key={option.name}
              value={option.value}
              $isSelected={selectedValue === option.value}
              onClick={() => {
                handleOptionClicked(option);
              }}
            >
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

const EnzoTimeDropDown = memo(TimeDropDown);
export default EnzoTimeDropDown;

