import styled, { css, keyframes } from 'styled-components';
import { ReactComponent as CrossHairIcon } from '../../../../assets/svgs/crosshair.svg';
import * as Sv from '../../../../styles/stylevariables';

const popAnimation = keyframes`
  0%, 100% {
    transform: scale(1);
    fill:${Sv.green};
  }
  15% {
    transform: scale(1);
    fill:${Sv.green};
    
  }
  35% {
    transform: scale(0.9);
    fill:${Sv.appBackground}; 
  }
  55% {
      transform: scale(1.2);
      fill:${Sv.green};
  }
  75% {
     transform: scale(1);
     fill:${Sv.green};
  }
`;
const QrIconWrapper = styled.div<{ $animate: boolean }>`
  animation: ${props => (props.$animate
    ? css`${popAnimation} 1.0s ease-in-out infinite`
    : 'none')};
  fill: ${Sv.lightgray};
`;
type Props = {
  animate: boolean;
};

const AnimatedCrossHair = ({ animate }: Props) => (
    <QrIconWrapper $animate={animate}>
      <CrossHairIcon />
    </QrIconWrapper>
);

export default AnimatedCrossHair;
