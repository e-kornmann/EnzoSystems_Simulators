import { memo, useCallback, useContext, useEffect } from 'react';
// styled components
import styled from 'styled-components';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
// svg images
import { ReactComponent as BinIcon } from '../../../local_assets/bin_EMPTY.svg';
import { ReactComponent as BinFullIcon } from '../../../local_assets/bin_FULL.svg';
import { ReactComponent as CardHolderIcon } from '../../../local_assets/card_holder.svg';
import { ReactComponent as SettingsIcon } from '../../../local_assets/settings.svg';
import { ReactComponent as CardHolderEmptyIcon } from '../../../local_assets/card_holder_EMPTY.svg';
import { ReactComponent as CardHolderLowIcon } from '../../../local_assets/card_holder_LOW.svg';

// types
import AppActions from '../../enums/AppActions';
import { SharedStyledFooter } from '../../../local_shared/DraggableModal/ModalTemplate';
import { SettingContext } from '../../contexts/dispatch/SettingContext';
import { APPSETTINGS, BINSTATUSES, STACKSTATUSES } from '../../enums/SettingEnums';

type Props = {
  showSettings: boolean;
  cardStack: number;
  binStack: number;
};

const StyledStackNr = styled('span')({
  marginRight: ' -5px',
});

const FooterComponent = ({ showSettings, cardStack, binStack }: Props) => {
  const { settingState, settingDispatch } = useContext(SettingContext);
  const appDispatch = useContext(AppDispatchContext);

  useEffect(() => {
    if (settingState.cardStackSettingIsClicked) {
      switch (settingState.stackStatus) {
        case STACKSTATUSES.EMPTY:
          appDispatch({ type: AppActions.SET_CARDSTACK, payload: 0 });
          break;
        case STACKSTATUSES.LOW:
          appDispatch({ type: AppActions.SET_CARDSTACK, payload: 3 });
          break;
        case STACKSTATUSES.FULL:
          appDispatch({ type: AppActions.SET_CARDSTACK, payload: 8 });
          break;
        default:
          break;
      }
      settingDispatch({ type: 'CARD_STACK_OPTION_IS_CLICKED', payload: false });
    }
    if (settingState.binStackSettingIsClicked) {
      switch (settingState.binStatus) {
        case BINSTATUSES.EMPTY:
          appDispatch({ type: AppActions.SET_BINSTACK, payload: 0 });
          break;
        case BINSTATUSES.FULL:
          appDispatch({ type: AppActions.SET_BINSTACK, payload: 8 });
          break;
        default:
          break;
      }
      settingDispatch({ type: 'BIN_STACK_OPTION_IS_CLICKED', payload: false });
    }
  }, [appDispatch, settingDispatch, settingState]);

  useEffect(() => {
    if (cardStack === 8) settingDispatch({ type: APPSETTINGS.CARD_STACK, payload: STACKSTATUSES.FULL });
    if (cardStack === 3) settingDispatch({ type: APPSETTINGS.CARD_STACK, payload: STACKSTATUSES.LOW });
    if (cardStack === 0) settingDispatch({ type: APPSETTINGS.CARD_STACK, payload: STACKSTATUSES.EMPTY });
    if (binStack === 8) settingDispatch({ type: APPSETTINGS.BIN, payload: BINSTATUSES.FULL });
    if (binStack === 0) settingDispatch({ type: APPSETTINGS.BIN, payload: BINSTATUSES.EMPTY });
  }, [binStack, cardStack, settingDispatch, settingState.binStackSettingIsClicked, settingState.cardStackSettingIsClicked]);

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
           <StyledStackNr>{ cardStack }</StyledStackNr>
              { settingState.stackStatus === STACKSTATUSES.FULL && <CardHolderIcon width={24}/> }
              { settingState.stackStatus === STACKSTATUSES.LOW && <CardHolderLowIcon width={24}/> }
              { settingState.stackStatus === STACKSTATUSES.EMPTY && <CardHolderEmptyIcon width={24}/> }
            </div>
            <div onClick={handleBinKey}>
            <StyledStackNr>{ binStack }</StyledStackNr>
              { settingState.binStatus === BINSTATUSES.EMPTY && <BinIcon width={24}/> }
              { settingState.binStatus === BINSTATUSES.FULL && <BinFullIcon width={24}/> }
            </div>
          </>
        }
      </SharedStyledFooter>
  );
};

export const Footer = memo(FooterComponent);
