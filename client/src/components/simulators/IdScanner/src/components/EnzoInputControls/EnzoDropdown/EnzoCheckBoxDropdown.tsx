import { memo, useCallback, useEffect, useRef, useState } from 'react';
// svgs
import styled from 'styled-components';
import { ReactComponent as CheckMarkIcon } from '../../../../local_assets/checkmark.svg';
import { ReactComponent as ArrowIcon } from '../../../../local_assets/arrow_up-down.svg';
// styled components
import AddKeyFieldType from '../../../local_types/AddKeyFieldType';
import KeyType from '../../../types/PassPortType';

const StyledControl = styled('div')<{
  $hasValue?: boolean
}>(({ $hasValue }) => ({
  marginTop: '8px',
  height: '34px',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  position: 'relative',
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
  borderColor: $isFocus ? theme.colors.buttons.special : theme.colors.buttons.gray,
  borderRadius: '3px',
  padding: '11px 8px 0px',
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
    height: '6px',
  },
  pointerEvents: 'none',
}));
const Wrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  columnGap: '8px',
});
const StyledCheckBox = styled('div')<{
  $isSelected: boolean
}>(({ $isSelected, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '12px',
  height: '12px',
  border: `1px solid ${$isSelected
    ? theme.colors.buttons.special
    : theme.colors.text.primary}`,
  borderRadius: '1px',
  cursor: 'pointer',
  backgroundColor: $isSelected
    ? theme.colors.buttons.special
    : theme.colors.background.primary,
  '& > svg': {
    marginLeft: '1px',
    fill: $isSelected ? theme.colors.text.primary : 'transparent',
  },
}));
const StyledOptionsContainer = styled('div')<{
  $showOptions: boolean
}>(({ $showOptions }) => ({
  backgroundColor: 'transparent',
  display: $showOptions ? 'flex' : 'none',
  position: 'absolute',
  flexDirection: 'column',
  top: '33px',
  width: '100%',
  zIndex: '2',
  height: '80px',
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
  marginBottom: '10px',
  zIndex: '2',
  '& > :first-child': {
    padding: '10px 9px 5px',
  },
  '& > :last-child': {
    padding: '5px 9px 10px',
  },
}));
const StyledOption = styled('div')<{
  $isSelected: boolean,
  value: string
}>(({ theme, $isSelected }) => ({
  backgroundColor: theme.colors.background.primary,
  color: $isSelected ? theme.colors.text.secondary : theme.colors.text.primary,
  padding: '5px 9px',
  cursor: 'pointer',
}));

type Option = {
  name: string,
  value: string
};

type Props = {
  data: string[] | null,
  field: AddKeyFieldType,
  label: string,
  options: Option[],
  onOptionClicked: (value: string[], field: keyof KeyType) => void
};

const EnzoCheckBoxDropDownComponent = ({
  data, field, options, onOptionClicked,
}: Props) => {
  const [selectedValue, setSelectedValue] = useState(['']);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) {
      setSelectedValue(data);
    }
  }, [data]);

  const handleOptionClicked = useCallback((option: Option) => {
    if (option.value === '') {
      return; // Ignore empty options
    }

    let updatedValue;

    if (selectedValue.includes(option.value)) {
      updatedValue = selectedValue.filter(value => value !== option.value);
    } else {
      updatedValue = [...selectedValue, option.value];
    }

    // Filter out empty values from the updated array
    updatedValue = updatedValue.filter(value => value !== '');
    setSelectedValue(updatedValue);
    onOptionClicked(updatedValue, field.source as keyof KeyType);
  }, [field, selectedValue, onOptionClicked]);

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
    <StyledControl $hasValue={selectedValue[0] !== ''} ref={optionsRef}>
      <label>{field.name}</label>
      <StyledSelect ref={optionsRef} onClick={handleClick} $isFocus={showOptions}>
        {selectedValue.join(', ')}
      </StyledSelect>

      <StyledOptionsContainer ref={optionsRef} $showOptions={showOptions}>
        <StyledClickableContainer onClick={handleClick} />
        <StyledOptions>
          {options.map(option => (
            <StyledOption
              key={option.name}
              value={option.value}
              $isSelected={selectedValue.includes(option.value)}
              onClick={() => {
                handleOptionClicked(option);
              }}
            >
              <Wrap>
                <StyledCheckBox $isSelected={selectedValue.includes(option.value)}>
                  <CheckMarkIcon width={9} height={6} />
                </StyledCheckBox>
                <span>{option.name}</span>
              </Wrap>
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

export const EnzoCheckBoxDropDown = memo(EnzoCheckBoxDropDownComponent);
