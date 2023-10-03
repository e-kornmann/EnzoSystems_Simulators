import { memo, useCallback, useContext } from 'react';
// styled components
import styled from 'styled-components';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
// svg images
import { ReactComponent as BinIcon } from '../../../local_assets/trashcan.svg';
import { ReactComponent as CardStackIcon } from '../../../local_assets/card_holder.svg';
import { ReactComponent as SettingsIcon } from '../../../local_assets/settings.svg';
// types
import ActionType from '../../enums/ActionTypes';
import { SharedStyledFooter } from '../../../local_shared/DraggableModal/ModalTemplate';
import { SettingContext } from '../../contexts/dispatch/SettingContext';
import STACKSTATUSES from '../../enums/StackStatus';

type Props = { showSettings: boolean };

const StyledWarningContainer = styled('div')({
  position: 'relative',
  display: 'flex',
});

const FooterComponent = ({ showSettings }: Props) => {
  const { settingState } = useContext(SettingContext);
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
              { settingState.stackStatus === STACKSTATUSES.EMPTY && <StyledWarningContainer>'!'</StyledWarningContainer> }
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
