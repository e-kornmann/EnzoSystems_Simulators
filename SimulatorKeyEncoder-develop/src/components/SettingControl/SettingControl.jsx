import { memo } from 'react';
// styled components
import styled from 'styled-components';

const StyledWrapper = styled('div')({});
const StyledSetting = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.colors.border.primary}`,
  borderRadius: '5px',
  cursor: 'pointer',
  display: 'grid',
  gridTemplateColumns: '4fr 1fr',
  padding: '8px 12px',
  width: '100%'
}));
const StyledTitle = styled('div')({
  fontWeight: '600'
});
const StyledValue = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end'
});
const StyledOptionList = styled('div')({
  display: 'grid',
  gridTemplateColumns: '1fr',
  margin: '0 10%',
  rowGap: '10px',
  width: '80%'
});
const StyledOption = styled('div')(({ theme }) => ({
  border: `1px solid ${theme.colors.border.primary}`,
  borderRadius: '5px',
  cursor: 'pointer',
  display: 'grid',
  gridTemplateColumns: '4fr 1fr',
  padding: '8px 12px',
  width: '100%'
}));
const StyledOptionName = styled('div')({
  fontWeight: '600'
});
const StyledOptionRadio = styled('input')({
  display: 'flex',
  justifyContent: 'flex-end'
});

const SettingControl = ({ clicked, setting, onOptionClicked, onSettingClicked }) => {
  return (
    <StyledWrapper>
      {!clicked &&
        <StyledSetting onClick={() => { onSettingClicked(setting); }}>
          <StyledTitle>
            {setting.title}
          </StyledTitle>
          <StyledValue>
            {setting.currentValue}
          </StyledValue>
        </StyledSetting>}
      {clicked &&
        <StyledOptionList>
          {setting.options.map((option) => (
            <StyledOption key={option} onClick={() => { onOptionClicked(option, setting); }}>
              <StyledOptionName>{option}</StyledOptionName>
              <StyledOptionRadio type='radio' checked={option === setting.currentValue} readOnly />
            </StyledOption>
          ))}
        </StyledOptionList>}
    </StyledWrapper>
  );
};

export default memo(SettingControl);
