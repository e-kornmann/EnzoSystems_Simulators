import { memo, useCallback, useContext } from 'react';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
// svg images
import { ReactComponent as BinIcon } from '../../../local_assets/trashcan.svg';
import { ReactComponent as BinFullIcon } from '../../../local_assets/trashcan_FULL.svg';
import { ReactComponent as CardHolderIcon } from '../../../local_assets/card_holder.svg';
import { ReactComponent as SettingsIcon } from '../../../local_assets/settings.svg';
import { ReactComponent as CardHolderEmptyIcon } from '../../../local_assets/card_holder_EMPTY.svg';
import { ReactComponent as CardHolderLowIcon } from '../../../local_assets/card_holder_LOW.svg';

// types
import AppActions from '../../enums/AppActions';
import { SharedStyledFooter } from '../../../local_shared/DraggableModal/ModalTemplate';
import { SettingContext } from '../../contexts/dispatch/SettingContext';
import { BINSTATUSES, STACKSTATUSES } from '../../enums/SettingEnums';

type Props = { showSettings: boolean };

const FooterComponent = ({ showSettings }: Props) => {
  const { settingState } = useContext(SettingContext);
  const appDispatch = useContext(AppDispatchContext);

  const handleBinKey = useCallback(() => {
    appDispatch({ type: AppActions.SHOW_BACK, payload: true });
    appDispatch({ type: AppActions.SHOW_BIN_SETTINGS });
  }, [appDispatch]);

  const handleCardHolderKey = useCallback(() => {
    appDispatch({ type: AppActions.SHOW_BACK, payload: true });
    appDispatch({ type: AppActions.SHOW_STACK_SETTINGS });
  }, [appDispatch]);

  const handleToggleSettings = useCallback(() => {
    appDispatch({ type: AppActions.TOGGLE_SETTINGS });
  }, [appDispatch]);

  return (
  <SharedStyledFooter>
        {!showSettings
          && <>
            <div onClick={handleToggleSettings}>
              <SettingsIcon width={16} height={16} />
            </div>
            <div onClick={handleCardHolderKey}>
              { settingState.stackStatus === STACKSTATUSES.FULL && <CardHolderIcon width={24}/> }
              { settingState.stackStatus === STACKSTATUSES.LOW && <CardHolderLowIcon width={24}/> }
              { settingState.stackStatus === STACKSTATUSES.EMPTY && <CardHolderEmptyIcon width={24}/> }
            </div>
            <div onClick={handleBinKey}>
              { settingState.binStatus === BINSTATUSES.EMPTY && <BinIcon width={24}/> }
              { settingState.binStatus === BINSTATUSES.FULL && <BinFullIcon width={24}/> }
            </div>
          </>
        }
      </SharedStyledFooter>
  );
};

export const Footer = memo(FooterComponent);
