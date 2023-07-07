import { css } from 'styled-components';

export const breakpoints = {
  mobile: 'only screen and (max-width : 480px)',
  small: 'only screen and (min-width : 481px) and (max-width : 768px)',
  medium: 'only screen and (min-width : 769px) and (max-width : 992px)',
  large: 'only screen and (min-width : 993px) and (max-width : 1200px)',
  xlarge: 'only screen and (min-width : 1201px)'
};

export const black = '#141414';
export const asphalt = '#3a3a3d';
export const green = '#55AD3C';
export const yellow = '#FFCB00';
export const red = '#FF1010';
export const enzoOrange = '#FA8A00'

export const blackText = css`
  color: ${black};
`;

