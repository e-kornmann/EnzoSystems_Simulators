import { memo } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { ReactComponent as CrossHairIcon } from '../../../local_assets/present_id.svg';

const popAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
    fill: ${props => props.theme.colors.buttons.green}
  }
  15% {
    transform: scale(1);
    fill: ${props => props.theme.colors.buttons.green}
    
  }
  35% {
    transform: scale(0.9);
    fill: ${props => props.theme.colors.background.primary}
  }
  55% {
      transform: scale(1.2);
      fill: ${props => props.theme.colors.buttons.green}
  }
  75% {
     transform: scale(1);
     fill: ${props => props.theme.colors.buttons.green}
  }
`;
const StyledIconWrapper = styled.div<{ $animate: boolean }>`
  animation: ${props => (props.$animate
    ? css`${popAnimation} 1.0s ease-in-out infinite`
    : 'none')};
  fill: ${props => props.theme.colors.buttons.lightgray}
`;

type Props = {
  animate: boolean;
};

const AnimatedCrossHairComponent = ({ animate }: Props) => (
    <StyledIconWrapper $animate={animate}>
      <CrossHairIcon />
    </StyledIconWrapper>
);

export const AnimatedCrossHair = memo(AnimatedCrossHairComponent);
