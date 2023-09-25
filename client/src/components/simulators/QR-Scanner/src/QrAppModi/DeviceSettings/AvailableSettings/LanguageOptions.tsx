import { useCallback, useContext } from 'react';
import { AppContext, SettingModes } from '../../../utils/settingsReducer';
import * as S from '../../../../local_shared/DraggableModal/ModalTemplate';
import { ReactComponent as Arrow } from '../../../../local_assets/arrow_back.svg';
import { ArrowWrapper } from '../DeviceSettings';
import ts from '../../../Translations/translations';
import { QrAppModi } from '../../../App';
import { SharedCheckMark } from '../../../../local_shared/CheckAndCrossIcon';

enum LangEnum {
  DUTCH = 'dutch',
  ENGLISH = 'english',
}

type Props = {
  arrowBackButtonHandler: () => void;
  modusSetterHandler: (modus: QrAppModi) => void;
};

const LanguageOptions = ({ arrowBackButtonHandler, modusSetterHandler }: Props) => {
  const { state, dispatch } = useContext(AppContext);

  const onChangeEventHandler = useCallback((mode: LangEnum) => {
    dispatch({ type: SettingModes.LANGUAGE, payload: mode });
    modusSetterHandler(QrAppModi.QR_SCANNER);
  }, [dispatch, modusSetterHandler]);

  return (
    <S.SharedStyledList>

      <ArrowWrapper onClick={arrowBackButtonHandler} >
       <Arrow width={12} height={12} />
      </ArrowWrapper>
      {Object.values(LangEnum).map(language => (
        <S.SharedStyledListButton key={language} onClick={() => onChangeEventHandler(language)}>
          { ts(language, state.language) }
          <SharedCheckMark isDisplayed={state.language === language } width={14} height={11} />
        </S.SharedStyledListButton>
      ))}
    </S.SharedStyledList>
  );
};

export default LanguageOptions;
