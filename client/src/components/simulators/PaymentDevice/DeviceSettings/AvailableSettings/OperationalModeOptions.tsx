import { useContext } from 'react';
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import * as S from '../../../../shared/DraggableModal/ModalTemplate';
import { SharedCheckMark } from '../../../../shared/CheckAndCrossIcon';
import ts from '../../Translations/translations';

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
    <S.GenericList>
      {Object.values(OperationalModeOptionsType).map(mode => (
        <S.GenericListButton key={mode} onClick={() => onChangeEventHandler(mode)}>

          {ts(mode, state.language)}

          <SharedCheckMark isDisplayed={state.operationalModeOption === mode } width={14} height={11} />
        </S.GenericListButton>
      ))}
    </S.GenericList>
  );
};

export default OperationalModeOptions;
