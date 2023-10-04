import { memo, useCallback, useContext } from 'react';
// context
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
// components
import { SharedStyledHeader } from '../../../local_shared/DraggableModal/ModalTemplate';
// svg images
import { ReactComponent as ArrowBack } from '../../../local_assets/arrow_back.svg';
import { ReactComponent as CloseIcon } from '../../../local_assets/close.svg';
// types
import AppActions from '../../enums/AppActions';

type Props = {
  showBack: boolean,
  showCross: boolean,
  title: string
};

const HeaderComponent = ({ showBack, showCross, title }: Props) => {
  const appDispatch = useContext(AppDispatchContext);

  const handleClickBack = useCallback(() => {
    appDispatch({ type: AppActions.CLICKED_BACK, payload: true });
  }, [appDispatch]);

  const handleClickCross = useCallback(() => {
    appDispatch({ type: AppActions.CLICKED_CROSS });
  }, [appDispatch]);

  return (
    <SharedStyledHeader>
      <button disabled={!showBack} type="button" onClick={handleClickBack}>
        {showBack && <ArrowBack width={12} height={12} />}
      </button>
      {title}
      <button disabled={!showCross} type="button" onClick={handleClickCross}>
        {showCross && <CloseIcon width={11} height={11} />}
      </button>
    </SharedStyledHeader>
  );
};

export const Header = memo(HeaderComponent);
