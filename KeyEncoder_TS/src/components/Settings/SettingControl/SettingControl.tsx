import { memo } from 'react';
// styled components
import styled from 'styled-components';
// svgs
import { ReactComponent as Arrow } from '../../../../images/arrow.svg';
import { ReactComponent as CheckmarkIcon } from '../../../../images/success.svg';

const StyledSettingControl = styled('div')({});
const StyledButton = styled('button')(({ theme }) => ({
  alignItems: 'center',
  borderBottom: `0.13em solid ${theme.colors.border.primary}`,
  columnGap: '20px',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'row',
  fontSize: '0.9em',
  height: '40px',
  justifyContent: 'space-between',
  padding: '11px',
  textAlign: 'left',
  width: '100%',
  '&:active': {
    backgroundColor: theme.colors.background.special,
    fill: theme.colors.buttons.special
  },
  '& > svg': {
    minWidth: '14px'
  }
}));
// const StyledSettingButton = styled(StyledButton)({
//   '& > svg': {
//     height: '11px'
//   }
// });
const StyledOptionButton = styled(StyledButton)({});
const StyledCheckmark = styled(CheckmarkIcon)(({ theme }) => ({
  fill: theme.colors.buttons.special,
  height: '11px',
  width: '14px'
}));

type SettingControlProps = {
  isSelected?: boolean,
  isSetting?: boolean,
  text: string,
  onClick: () => void
};

const SettingControlComponent = ({ isSelected, isSetting, text, onClick }: SettingControlProps) => {
  return (
    <StyledSettingControl>
      {isSetting &&
        <StyledButton onClick={onClick}>
          {text}
          <Arrow />
        </StyledButton>}

      {!isSetting &&
        <StyledOptionButton onClick={onClick}>
          {text}{isSelected && <StyledCheckmark />}
        </StyledOptionButton>}
    </StyledSettingControl>
  );
};

export const SettingControl = memo(SettingControlComponent);
