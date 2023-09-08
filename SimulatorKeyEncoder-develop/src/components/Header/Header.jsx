import { memo, useCallback, useContext } from 'react';
// styled components
import styled from 'styled-components';
// context
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';
// svgs
import { ReactComponent as ArrowBack } from '../../../images/arrow_back.svg';
import { ReactComponent as CloseIcon } from '../../../images/close.svg';

export const StyledHeader = styled('div')(({ theme }) => ({
  display: "flex",
  padding: "0 8px 0 9px",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "500",
  borderTopLeftRadius: "5px",
  borderTopRightRadius: "5px",
  backgroundColor: "white",
  color: theme.colors.text.secondary,
  '& > button': {
    cursor: "pointer",
    width: "13px",
    height: "13px",
    display: "grid",
    alignItems: "flex-end",
    '& > svg': {
      fill: theme.colors.text.primary,
    }
  }
}));

const Header = memo(function Header({ showBack, showCross, title }) {
  const appDispatch = useContext(AppDispatchContext);

  const handleClickBack = useCallback(() => {
    appDispatch({ type: 'clicked-back', payload: true });
  }, [appDispatch]);

  const handleClickCross = useCallback(() => {
    appDispatch({ type: 'clicked-cross' });
  }, [appDispatch]);

  return (
    <StyledHeader>
      <button disabled={!showBack} type="button" onClick={handleClickBack}>
        {showBack && <ArrowBack width={12} height={12} />}
      </button>
      {title}
      <button disabled={!showCross} type="button" onClick={handleClickCross}>
        {showCross && <CloseIcon width={11} height={11} />}
      </button>
    </StyledHeader>
  );
})

export default Header;

