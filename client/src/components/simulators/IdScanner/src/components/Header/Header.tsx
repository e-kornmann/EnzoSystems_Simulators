import { memo, useCallback, useContext } from 'react';
// styled components
import { SharedStyledHeader } from '../../../local_shared/DraggableModal/ModalTemplate';
// context
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
// svg images
import { ReactComponent as ArrowBack } from '../../../local_assets/arrow_back.svg';
import { ReactComponent as CloseIcon } from '../../../local_assets/close.svg';
import ActionType from '../../enums/ActionTypes';

type Props = {
  showBack: boolean,
  showCross: boolean,
  title: string
  goBackToKeysButton: boolean,
};

const HeaderComponent = ({
  showBack, showCross, title, goBackToKeysButton,
}: Props) => {
  const appDispatch = useContext(AppDispatchContext);

  const handleClickBack = useCallback(() => {
    if (goBackToKeysButton) {
      appDispatch({ type: ActionType.SHOW_IDS, payload: true });
    }
    appDispatch({ type: ActionType.CLICKED_BACK, payload: true });
  }, [appDispatch, goBackToKeysButton]);

  const handleClickCross = useCallback(() => {
    appDispatch({ type: ActionType.CLICKED_CROSS });
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
