import { memo, useCallback, useContext } from 'react';
// styled components
import styled from 'styled-components';
// context
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';

export const StyledHeader =  styled('div')(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "500",
  borderTopLeftRadius: "5px",
  borderTopRightRadius: "5px",
  backgroundColor: "white",
  color: theme.colors.text.secondary,

  '& > svg': {
    position: "relative",
    fill: theme.colors.text.primary, 
    cursor: "pointer",
  },

  '& > div':  {
    '& > svg': {
      position: "relative",
      fill: theme.colors.text.primary,  
      cursor: "pointer",
    }
  }
}));
const StyledTitle = styled('div')(({ theme }) => ({
  alignItems: 'center',
  color: theme.colors.text.secondary,
  cursor: 'pointer',
  display: 'flex',
  fontSize: '1.0em',
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
  }, [appDispatch]);

  const handleClickCross = useCallback(() => {
    appDispatch({ type: 'clicked-cross', payload: true });
  }, [appDispatch]);

  return (
    <StyledHeader>
      <StyledBack $showBack={showBack} onClick={() => { handleClickBack(); }} />
      <StyledTitle>{title}</StyledTitle>
      <StyledCross $showCross={showCross} onClick={() => { handleClickCross(); }} />
    </StyledHeader>
  );
};

export default memo(Header);
