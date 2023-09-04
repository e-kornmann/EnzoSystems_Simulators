import { memo, useCallback, useEffect, useRef, useState } from 'react';
// styled components
import styled from 'styled-components';


const StyledControl = styled('div')(({ theme, $hasValue }) => ({
    marginTop: '10px',
    height: '36px',
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
      backgroundColor: 'white',
      padding: '3px 5px',
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

const StyledSelect = styled('div')(({ theme, $isFocus }) => ({
    backgroundColor: theme.colors.background.primary,
    color: theme.colors.text.primary,
    fontSize: '1.0em',
    fontWeight: '500',
    border: '0.12em solid',
    borderColor: $isFocus ? theme.colors.brandColors.enzoOrange : theme.colors.buttons.gray,
    borderRadius: '3px',
    padding: '9px 8px 2px',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
}));

const StyledOptions = styled('div')(({ theme, $showOptions }) => ({
  backgroundColor: theme.colors.background.primary,
  border: `1px solid ${theme.colors.border.primary}`,
  display: $showOptions ? 'block' : 'none',
  height: '120px',
  padding: '4px',
  position: 'absolute',
  top: '36px',
  width: '100%',
  zIndex: '2',
  overflowY: 'scroll',
}));

const StyledOption = styled('div')(({ theme, $isSelected }) => ({
  backgroundColor: $isSelected ? theme.colors.brandColors.enzoOrange : theme.colors.background.primary,
  color: $isSelected ? theme.colors.text.black : theme.colors.text.primary,
  padding: '5px',
  cursor: 'pointer',
}));

const EnzoTimeDropdown = ({ defaultValue, field, label, options, onOptionClicked }) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const selectRef = useRef(null);


  const handleOptionClicked = useCallback((option) => {
    setSelectedValue(option.value);
    onOptionClicked(option.value, field);
    setShowOptions(false);
  }, [field]);


  const handleClickedArrow = useCallback(() => setShowOptions((prev) => !prev), []);

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



  useEffect(() => {
    optionsRef.current.scrollTo(0, 500);
  }, []);

  return (
    <StyledControl>

      <StyledSelect $isFocus={showOptions} ref={selectRef} onClick={handleClickedArrow}> {options?.find((option) => option.value === selectedValue)?.name || label}</StyledSelect>
      <StyledOptions ref={optionsRef} $showOptions={showOptions}>
        {options.map((option) => (
          <StyledOption key={option.name} value={option.value} $isSelected={selectedValue === option.value} onClick={() => { handleOptionClicked(option); }}>{option.name}</StyledOption>
        ))}
      </StyledOptions>
    </StyledControl>
  );
};

export default memo(EnzoTimeDropdown);
