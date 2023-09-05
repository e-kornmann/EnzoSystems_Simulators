import { memo, useCallback, useEffect, useRef, useState } from 'react';
// styled components
import styled from 'styled-components';
// import StyledArrow from './EnzoDropdown';
import { ReactComponent as ArrowIcon } from '../../../images/arrow_up-down.svg';


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
    padding: '11px 8px 0px',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
}));


const StyledArrow = styled('div')(({ theme, $arrowDown }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '20px',
    height: '20px',
    position: 'absolute',
    right: '5px',
    top: '8px',
    transform: $arrowDown ? 'rotate(0deg)' : 'rotate(180deg)',
    '& > svg': {
      fill: theme.colors.text.primary,
      width: '13px',
      height: '6px'
    },
    pointerEvents: 'none',
  }));
  
const StyledOptionsContainer = styled('div')(({ theme, $showTimeOptions }) => ({
    backgroundColor: 'transparent',
    display: $showTimeOptions ? 'flex' : 'none',
    position: 'absolute',
    flexDirection: 'column',
    top: '0',
    width: '100%',
    zIndex: '2',
    height: '150px',
}));


const StyledClickableContainer =  styled('div')({
    backgroundColor: 'transparent',
    display: 'flex',
    height: '36px',
    width: '100%',
    cursor: 'pointer',
    });
  

const StyledOptions = styled('div')(({ theme }) => ({
    backgroundColor: 'white',
    border: `1px solid ${theme.colors.buttons.lightgray}`,
    borderRadius: '2px',
    width: '100%',
    zIndex: '2',
    height: '100%',
    zIndex: '2',
    overflowY: 'scroll',
    overflowX: 'hidden',
     '& > :first-child': {
        padding: '10px 9px 5px',
    },
     '& > :last-child': {
    padding: '5px 9px 10px',
   }
}));

const StyledOption = styled('div')(({ theme, $isSelected }) => ({
  backgroundColor: $isSelected ? theme.colors.brandColors.enzoOrange : theme.colors.background.primary,
  color: $isSelected ? theme.colors.text.black : theme.colors.text.primary,
  padding: '5px 9px',
  cursor: 'pointer',
}));

const EnzoTimeDropDown = ({ defaultValue, field, label, options, onOptionClicked }) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue);
    const [showTimeOptions, setShowTimeOptions] = useState(false);
    const selectRef = useRef(null);
  
    const handleOptionClicked = useCallback((option) => {
        setShowTimeOptions(false);
        setSelectedValue(option.value);
        onOptionClicked(option.value);
      }, [field]);
  
    const handleClick = useCallback(() => {
      setShowTimeOptions((prev) => !prev);
    }, []);

  
    return (
      <StyledControl>
        <StyledSelect $isFocus={showTimeOptions} ref={selectRef} onClick={handleClick}>
          {options?.find((option) => option.value === selectedValue)?.name || label}
        </StyledSelect>
  
        <StyledOptionsContainer $showTimeOptions={showTimeOptions}>
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
  
        <StyledArrow $arrowDown={showTimeOptions}>
          <ArrowIcon />
        </StyledArrow>
      </StyledControl>
    );
  };
  
  export default memo(EnzoTimeDropDown);