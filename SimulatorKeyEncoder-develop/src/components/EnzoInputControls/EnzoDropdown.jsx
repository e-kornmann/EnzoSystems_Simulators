import { memo, useCallback, useEffect, useRef, useState } from 'react';
// styled components
import styled from 'styled-components';

const StyledControl = styled('div')({
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
const StyledOptions = styled('div')(({ theme, $selectHeight, $showOptions }) => ({
  backgroundColor: theme.colors.background.primary,
  border: `1px solid ${theme.colors.border.primary}`,
  display: $showOptions ? 'block' : 'none',
  height: 'fit-content',
  padding: '4px',
  position: 'absolute',
  top: `${$selectHeight}px`,
  width: '100%',
  zIndex: '2'
}));
const StyledOption = styled('div')(({ theme, $isSelected }) => ({
  color: $isSelected ? theme.colors.text.secondary : theme.colors.text.primary
}));

const EnzoDropdown = ({ defaultValue, field, label, options, onOptionClicked }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [showOptions, setShowOptions] = useState(false);
  const [selectHeight, setSelectHeight] = useState(0);
  const optionsRef = useRef(null);
  const selectRef = useRef(null);

  const handleOptionClicked = useCallback((option) => {
    setSelectedValue(option.value);
    onOptionClicked(option.value, field);
    setShowOptions(false);
  }, [field]);

  useEffect(() => {
    if (selectRef.current) {
      setSelectHeight(selectRef.current.scrollHeight);
    }
  });

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (showOptions && optionsRef.current && !optionsRef.current.contains(e.target)) {
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
      <StyledSelect ref={selectRef} onClick={() => { setShowOptions((prev) => !prev); }}>{options?.find((option) => option.value === selectedValue)?.name || label}</StyledSelect>
      <StyledOptions ref={optionsRef} $selectHeight={selectHeight} $showOptions={showOptions}>
        {options.map((option) => (
          <StyledOption key={option.name} value={option.value} $isSelected={selectedValue === option.value} onClick={() => { handleOptionClicked(option); }}>{option.name}</StyledOption>
        ))}
      </StyledOptions>
    </StyledControl>
  );
};

export default memo(EnzoDropdown);
