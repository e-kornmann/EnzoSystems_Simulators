import { memo } from 'react';
//import prop-types
import PropTypes from 'prop-types';
// styled components
import styled from 'styled-components';
// svgs
import { ReactComponent as Arrow } from '../../../images/arrow.svg';
import { ReactComponent as CheckmarkIcon } from '../../../images/success.svg';

const StyledWrapper = styled('div')({});
const StyledButton = styled('button')(({ theme }) => ({
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
    fill: theme.colors.brandColors.enzoOrange
  }
}));

const StyledCheckMark = styled(CheckmarkIcon)(({ theme }) => ({
  width: '14px',
  height: '11px',
  fill: theme.colors.brandColors.enzoOrange,
}));

const ListOfOptions = ({ clicked, setting, onOptionClicked, onSettingClicked }) => {
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
            {option}{option === setting.currentValue && <StyledCheckMark />}
          </StyledButton>
        ))
      }
    </StyledWrapper>
  );
};

const SettingControl = memo(ListOfOptions)
export default SettingControl;

ListOfOptions.propTypes = {
  clicked: PropTypes.bool,
  setting: PropTypes.object,
  onOptionClicked: PropTypes.bool, 
  onSettingClicked: PropTypes.bool, 
}
