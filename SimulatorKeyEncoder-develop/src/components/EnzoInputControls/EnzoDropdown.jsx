import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ReactComponent as CheckMarkIcon } from '../../../images/checkmark.svg';
// styled components
import styled from 'styled-components';

const StyledControl = styled('div')(({ theme, $hasValue }) => ({
  marginTop: '10px',
  height: '36px',
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
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
  padding: '11px 8px 0px',
  width: '100%',
  height: '100%',
  cursor: 'pointer',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
}));

const Wrap = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
`;

const CheckMark = ({ isDisplayed, width, height }) => isDisplayed !== false
  && <CheckMarkIcon width={width} height={height} />;

const StyledCheckBox = styled('div')(
  ({ $isSelected, theme }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '12px',
    height: '12px',
    border: `1px solid ${$isSelected
      ? theme.colors.brandColors.enzoOrange
      : theme.colors.text.primary}`,
    borderRadius: '1px',
    cursor: 'pointer',
    backgroundColor: $isSelected
      ? theme.colors.brandColors.enzoOrange
      : theme.colors.background.primary,
    '& > svg': {
      marginLeft: '1px',
      fill: theme.colors.text.primary,
    },
  }),
);

const StyledOptions = styled('div')(({ theme, $showOptions }) => ({
  backgroundColor: theme.colors.background.primary,
  display: $showOptions ? 'block' : 'none',
  borderRadius: '0 0 3px 3px',
  height: 'fit-content',
  padding: '4px',
  position: 'absolute',
  top: '36px',
  width: '100%',
  zIndex: '2'
}));

const StyledOption = styled('div')(({ theme, $isSelected }) => ({
  color: $isSelected ? theme.colors.text.secondary : theme.colors.text.primary,
  padding: '4px',
  cursor: 'pointer',
}));

const EnzoDropdown = ({ defaultValue, field, options, onOptionClicked }) => {
  const [selectedValue, setSelectedValue] = useState([defaultValue]);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const selectRef = useRef(null);

  const handleOptionClicked = useCallback((option) => {
    if (option.value === '') {
      return; // Ignore empty options
    }

    let updatedValue;

    if (selectedValue.includes(option.value)) {
      updatedValue = selectedValue.filter((value) => value !== option.value);
    } else {
      updatedValue = [...selectedValue, option.value];
    }

    // Filter out empty values from the updated array
    updatedValue = updatedValue.filter((value) => value !== '');

    setSelectedValue(updatedValue);
    onOptionClicked(option, field);
  }, [field, selectedValue, onOptionClicked]);

  const handleClickedArrow = useCallback(() => setShowOptions((prev) => !prev), []);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (showOptions && optionsRef.current && !optionsRef.current.contains(e.target)) {
        // setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [showOptions]);

   

  return (

    <>
      <StyledControl $hasValue={selectedValue[0]} ref={selectRef}>
        <label>{field.name}</label>
        <StyledSelect onClick={handleClickedArrow} $isFocus={showOptions} >{selectedValue.join(', ')}</StyledSelect> 
      
      <StyledOptions ref={optionsRef} $showOptions={showOptions}>
        {options.map((option) => (
          <StyledOption key={option.name} value={option.value} $isSelected={selectedValue === option.value} onClick={() => { handleOptionClicked(option); }}>
            <Wrap>
              <StyledCheckBox $isSelected={selectedValue.includes(option.value)}>
                <CheckMark
                  isDisplayed={selectedValue.includes(option.value)}
                  width={9} height={6}
                />
              </StyledCheckBox>
              <span>{option.name}</span>

            </Wrap></StyledOption>
        ))}
      </StyledOptions>
      </StyledControl>
    </>
  );
};

export default memo(EnzoDropdown);

