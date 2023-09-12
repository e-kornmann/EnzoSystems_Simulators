import { memo, useCallback, useEffect, useRef, useState } from 'react';
// styled components
import styled from 'styled-components';
import AddKeyFieldType from '../../../types/AddKeyFieldType';

type StyledOptionsType = {
  $selectHeight: number,
  $showOptions: boolean
};
type StyledOptionType = {
  $isSelected: boolean,
  value: string
};

const StyledDropdown = styled('div')({ // TODO: change to <select> with <option> values
  height: '100%',
  position: 'relative',
  width: '100%'
});
const StyledSelect = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.colors.border.primary}`,
  height: '100%',
  padding: '4px',
  width: '100%'
}));
const StyledOptions = styled('div')<StyledOptionsType>(({ theme, $selectHeight, $showOptions }) => ({
  backgroundColor: theme.colors.background.primary,
  border: `1px solid ${theme.colors.border.primary}`,
  display: $showOptions ? 'block' : 'none',
  height: 'fit-content',
  padding: '4px',
  position: 'absolute',
  top: `${$selectHeight}px`,
  width: '100%',
  zIndex: 2
}));
const StyledOption = styled('div')<StyledOptionType>(({ theme, $isSelected }) => ({
  color: $isSelected ? theme.colors.text.secondary : theme.colors.text.primary
}));

type Option = {
  name: string,
  value: string
};

type EnzoDropdownProps = {
  defaultValue: string,
  field: AddKeyFieldType,
  label: string,
  options: Option[],
  onOptionClicked: (value: string, field: AddKeyFieldType) => void
};

const EnzoDropdownComponent = ({ defaultValue, field, label, options, onOptionClicked }: EnzoDropdownProps) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [showOptions, setShowOptions] = useState(false);
  const [selectHeight, setSelectHeight] = useState(0);
  const optionsRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<HTMLDivElement>(null);

  const handleOptionClicked = useCallback((option: Option) => {
    setSelectedValue(option.value);
    onOptionClicked(option.value, field);
    setShowOptions(false);
  }, [field, onOptionClicked]);

  useEffect(() => { // is supposed to happen every render, ignore warning
    if (selectRef.current) {
      setSelectHeight(selectRef.current.scrollHeight);
    }
  });

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
    <StyledDropdown>
      <StyledSelect ref={selectRef} onClick={() => { setShowOptions((prev) => !prev); }}>
        {options?.find((option) => option.value === selectedValue)?.name || label}
      </StyledSelect>
      <StyledOptions ref={optionsRef} $selectHeight={selectHeight} $showOptions={showOptions}>
        {options.map((option) => (
          <StyledOption key={option.name} value={option.value} $isSelected={selectedValue === option.value} onClick={() => { handleOptionClicked(option); }}>
            {option.name}
          </StyledOption>
        ))}
      </StyledOptions>
    </StyledDropdown>
  );
};

export const EnzoDropdown = memo(EnzoDropdownComponent);
