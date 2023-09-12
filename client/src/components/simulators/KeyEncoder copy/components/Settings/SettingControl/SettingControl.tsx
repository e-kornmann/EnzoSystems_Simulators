import { memo } from 'react';
// styled components
import styled from 'styled-components';
// svgs
import { ReactComponent as Arrow } from '../../../../../../assets/svgs/arrow.svg';
import { ReactComponent as CheckmarkIcon } from '../../../../../../assets/svgs/success.svg';

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
    backgroundColor: theme.colors.buttons.specialTransparent,
  },
}));

const StyledCheckmark = styled(CheckmarkIcon)(({ theme }) => ({
  fill: theme.colors.buttons.special,
  height: '11px',
  width: '14px',
}));

const StyledArrow = styled(Arrow)(({ theme }) => ({
  fill: theme.colors.text.primary,
  height: '11px',
  width: '14px',
}));

type SettingControlProps = {
  isSelected?: boolean,
  isSetting?: boolean,
  text: string,
  onClick: () => void
};

const SettingControlComponent = ({
  isSelected, isSetting, text, onClick,
}: SettingControlProps) => (
    <StyledSettingControl>
      {isSetting
        && <StyledButton onClick={onClick}>
          {text}
          <StyledArrow />
        </StyledButton>}

      {!isSetting
        && <StyledButton onClick={onClick}>
          {text}{isSelected && <StyledCheckmark />}
        </StyledButton>}
    </StyledSettingControl>
);

export const SettingControl = memo(SettingControlComponent);
