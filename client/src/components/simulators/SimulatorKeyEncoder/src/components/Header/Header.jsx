import { memo, useCallback, useContext } from 'react';
// styled components
import styled from 'styled-components';
// context
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';

const StyledHeader = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.primary,
  height: '100%',
  width: '100%'
}));
const StyledTitle = styled('div')(({ theme }) => ({
  alignItems: 'center',
  color: theme.colors.text.secondary,
  cursor: 'pointer',
  display: 'flex',
  fontSize: '20px',
  height: '100%',
  justifyContent: 'center',
  width: '100%'
}));
const StyledBack = styled('div')(({ $showBack }) => ({}));
const StyledCross = styled('div')(({ $showCross }) => ({}));

const Header = ({ showBack, showCross, title }) => {
  const appDispatch = useContext(AppDispatchContext);

  const handleClickBack = useCallback(() => {
    appDispatch({ type: 'clicked-back', payload: true });
  }, []);

  const handleClickCross = useCallback(() => {
    appDispatch({ type: 'clicked-cross', payload: true });
  }, []);

  return (
    <StyledHeader>
      <StyledBack $showBack={showBack} onClick={() => { handleClickBack(); }} />
      <StyledTitle>{title}</StyledTitle>
      <StyledCross $showCross={showCross} onClick={() => { handleClickCross(); }} />
    </StyledHeader>
  );
};

export default memo(Header);
