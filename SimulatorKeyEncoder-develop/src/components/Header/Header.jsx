import { memo, useCallback, useContext } from 'react';
// styled components
import styled from 'styled-components';
// context
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';
// svgs
import { ReactComponent as ArrowBack } from '../../../images/arrow_back.svg';
import { ReactComponent as CloseIcon } from '../../../images/close.svg';

export const StyledHeader =  styled('div')(({ theme }) => ({
  display: "flex",
  padding: "0 8px 0 9px",
  justifyContent: "space-between",
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
      <div>
  { showBack && <ArrowBack width={12} height={12} onClick={handleClickBack} style={{ top: '2px'}}/>  }
  </div>

  {title}
  <div>
  { showCross && <CloseIcon width={11} height={11} onClick={handleClickCross} />}
  </div>
  
    </StyledHeader>
  );
};

export default memo(Header);
