import { memo, useCallback, useContext } from 'react';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
// svg images
import { ReactComponent as BinIcon } from '../../../local_assets/trashcan.svg';
import { ReactComponent as CardStackIcon } from '../../../local_assets/card_holder.svg';
import { ReactComponent as SettingsIcon } from '../../../local_assets/settings.svg';
// types
import ActionType from '../../enums/ActionTypes';
import { SharedStyledFooter } from '../../../local_shared/DraggableModal/ModalTemplate';

type Props = { showSettings: boolean };

const FooterComponent = ({ showSettings }: Props) => {
  const appDispatch = useContext(AppDispatchContext);

  const handleBinKey = useCallback(() => {
    appDispatch({ type: ActionType.SHOW_BACK, payload: true });
    appDispatch({ type: ActionType.SHOW_BIN_SETTINGS });
  }, [appDispatch]);

  const handleCardStackKey = useCallback(() => {
    appDispatch({ type: ActionType.SHOW_STACK_SETTINGS });
  }, [appDispatch]);

  const handleToggleSettings = useCallback(() => {
    appDispatch({ type: ActionType.TOGGLE_SETTINGS });
  }, [appDispatch]);

  return (
  <SharedStyledFooter>
        {!showSettings
          && <>
            <div onClick={handleToggleSettings}>
              <SettingsIcon width={16} height={16} />
            </div>
            <div onClick={handleCardStackKey}>
              <CardStackIcon width={14} height={15} />
            </div>
            <div onClick={handleBinKey}>
              <BinIcon width={25} height={19} />
            </div>
          </>
        }
      </SharedStyledFooter>
  );
};

export const Footer = memo(FooterComponent);
