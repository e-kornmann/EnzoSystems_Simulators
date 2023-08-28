import { memo } from 'react';
// styled components
import styled from 'styled-components';
// svgs
import { ReactComponent as Arrow } from '../../../images/arrow.svg';
import { ReactComponent as CheckmarkIcon } from '../../../images/success.svg';


const StyledWrapper = styled('div')({});
const StyledButton = styled('button')(({ theme })=> ({
  display: 'flex',
  flexDirection: 'row',
  cursor: 'pointer',
  textAlign: 'left',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '0.13em solid ' + theme.colors.buttons.lightgray,
  width: '100%',
  height: '40px',
  fontSize: '0.9em',
  padding: '11px',
  columnGap: '20px',
  '& > svg': {
    minWidth: '14px'
  },
  '& > span': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '82%'
  },
  '&:active': {
    backgroundColor: theme.colors.brandColors.enzoLightOrange,
    fill :theme.colors.brandColors.enzoOrange
  }
}));


const StyledCheckMark = styled(CheckmarkIcon)(({ theme })=> ({
  width: '14px',
  height: '11px',
  fill: theme.colors.brandColors.enzoOrange,
}));

// const StyledSetting = styled('div')(({ theme }) => ({
//   border: `1px solid ${theme.colors.border.primary}`,
//   borderRadius: '5px',
//   cursor: 'pointer',
//   display: 'grid',
//   gridTemplateColumns: '4fr 1fr',
//   padding: '8px 12px',
//   width: '100%'
// }));
// const StyledTitle = styled('div')({
//   fontWeight: '600'
// });
// const StyledValue = styled('div')({
//   display: 'flex',
//   justifyContent: 'flex-end'
// });
// const StyledOptionList = styled('div')({
//   display: 'grid',
//   gridTemplateColumns: '1fr',
//   margin: '0 10%',
//   rowGap: '10px',
//   width: '80%'
// });
// const StyledOption = styled('div')(({ theme }) => ({
//   border: `1px solid ${theme.colors.border.primary}`,
//   borderRadius: '5px',
//   cursor: 'pointer',
//   display: 'grid',
//   gridTemplateColumns: '4fr 1fr',
//   padding: '8px 12px',
//   width: '100%'
// }));
// const StyledOptionName = styled('div')({
//   fontWeight: '600'
// });
// const StyledOptionRadio = styled('input')({
//   display: 'flex',
//   justifyContent: 'flex-end'
// });

const SettingControl = ({ clicked, setting, onOptionClicked, onSettingClicked, theme }) => {
  return (
    <StyledWrapper>
      {!clicked &&
        <StyledButton onClick={() => { onSettingClicked(setting); }}> 
            {setting.title}
            <Arrow height={11} />
        </StyledButton>}
      
      {clicked &&
          setting.options.map((option) => (
            <StyledButton key={option} onClick={() => { onOptionClicked(option, setting); }}>
              {option}
               
            {option === setting.currentValue && <StyledCheckMark/>}
            </StyledButton>
          ))
        
        
        
          }
          </StyledWrapper>
  );
};

export default memo(SettingControl);



