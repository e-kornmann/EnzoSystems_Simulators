import { useContext } from 'react';
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import * as S from '../../../../shared/DraggableModal/ModalTemplate';

import ts from '../../Translations/translations';
import { ReactComponent as CheckMarkIcon } from '../../../../../assets/svgs/checkmark.svg';

const PinOptions = () => {
  const { state, dispatch } = useContext(AppContext);

  const onChangeEventHandler = (askForPin: boolean) => {
    dispatch({ type: SettingModes.ASK_FOR_PIN, payload: askForPin });
  };

  return (
    <S.SharedStyledList>
      <S.SharedStyledListButton key={'PinYes'} onClick={() => onChangeEventHandler(true)}>
      {ts('yes', state.language)}
      { state.askForPin === true && <CheckMarkIcon width={14} height={11} /> }
      </S.SharedStyledListButton>
      <S.SharedStyledListButton key={'PinNo'} onClick={() => onChangeEventHandler(false)}>
      {ts('no', state.language)}
      { state.askForPin === false && <CheckMarkIcon width={14} height={11} /> }
      </S.SharedStyledListButton>
    </S.SharedStyledList>
  );
};
export default PinOptions;
