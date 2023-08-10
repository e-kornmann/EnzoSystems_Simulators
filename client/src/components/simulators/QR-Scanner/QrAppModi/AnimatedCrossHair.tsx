import { ReactComponent as CrossHairIcon } from '../../../../assets/svgs/crosshair.svg';
import styled, { css, keyframes } from 'styled-components';
import * as Sv from '../../../../styles/stylevariables';


const popAnimation = keyframes`
  0%, 100% {
    transform: scale(0.9);
    fill:${Sv.green}; /* Starting color */
  }
  15% {
    transform: scale(1);
    fill:${Sv.darkgreen}; /* Mid-color */
  }
  35% {
    transform: scale(1.1);
    fill:${Sv.appBackground}; /* Another mid-color */
  60% {
     transform: scale(0.95);
     fill:${Sv.green}; /* Another mid-color */
`;
const QrIconWrapper = styled.div<{$animate: boolean}>`
  animation: ${(props) =>
    props.$animate
      ? css`${popAnimation} 1.0s ease-in-out infinite`
      : 'none'};
  fill: ${Sv.lightgray};
`;
type Props = {
    animate: boolean;
}

const AnimatedCrossHair = ({animate}: Props) => {
  return (
    <QrIconWrapper $animate={animate}>
      <CrossHairIcon />
    </QrIconWrapper>
  );
};

export default AnimatedCrossHair;
