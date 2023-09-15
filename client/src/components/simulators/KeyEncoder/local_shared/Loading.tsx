import { memo } from 'react';
import styled, { keyframes } from 'styled-components';

const scaleUp = keyframes`
  0% { 
    transform: translate(-50%, -50%) scale(0) 
  }
  60% , 100% { 
    transform: translate(-50%, -50%)  scale(1)}
`;
const pulse = keyframes`
  0% , 60% , 100% { 
    transform:  scale(1) 
  }
  80% { 
    transform:  scale(1.2)
  }
`;

const Loader = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid #FFF;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  position: relative;
  animation: ${pulse} 1s linear infinite;
  &::after {
  content: '';
  position: absolute;
  width: 30px;
  height: 30px;
  border: 4px solid ${props => props.theme.colors.text.secondary};
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: ${scaleUp} 1s linear infinite;
  }`;

const Loading = ({ isDisplayed }: { isDisplayed?: boolean }) => isDisplayed !== false
  && <Loader/>;
const SharedLoading = memo(Loading);

export default SharedLoading;
