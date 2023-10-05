import { useContext } from 'react';
import { AppContext, SettingModes } from '../../../utils/settingsReducer';
import * as S from '../../../../local_shared/DraggableModal/ModalTemplate';
import { ReactComponent as CheckMarkIcon } from '../../../../local_assets/checkmark.svg';
import ts from '../../../Translations/translations';

export enum OperationalModeOptionsType {
  NORMAL = 'normal',
  ALWAYS_SUCCEED = 'alwaysSucceed',
  ALWAYS_FAIL = 'alwaysFails',
  FIRST_FAIL = 'firstFail',
}

const OperationalModeOptions = () => {
  const { state, dispatch } = useContext(AppContext);

  const onChangeEventHandler = (mode: OperationalModeOptionsType) => {
    dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: mode });
  };

  return (
    <S.SharedStyledList>
      {Object.values(OperationalModeOptionsType).map(mode => (
        <S.SharedStyledListButton key={mode} onClick={() => onChangeEventHandler(mode)}>

          {ts(mode, state.language)}
          { state.operationalModeOption === mode && <CheckMarkIcon width={14} height={11} />}
        </S.SharedStyledListButton>
      ))}
    </S.SharedStyledList>
  );
};

export default OperationalModeOptions;
