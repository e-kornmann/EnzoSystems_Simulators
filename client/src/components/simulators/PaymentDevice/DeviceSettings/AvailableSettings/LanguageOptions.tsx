
import { useContext } from 'react';
import { AppContext, Lang, SettingModes } from '../../utils/settingsReducer';
import Checkmark from '../checkmark/Checkmark';
import * as S from '../../../../shared/DraggableModal/ModalTemplate';
import ts from '../../Translations/translations';





const LanguageOptions = () => {
  const { state, dispatch } = useContext(AppContext);
  
  const onChangeEventHandler = (mode: Lang) => {
    dispatch({ type: SettingModes.LANGUAGE, payload: mode });
  };

  return (
    <S.GenericList>
      {Object.values(Lang).map((language) => (
        <S.GenericListButton key={language} onClick={() => onChangeEventHandler(language)}>
          { ts(language, state.language) }
          <Checkmark isDisplayed={state.language === language }/>
        </S.GenericListButton>
      ))}
    </S.GenericList>
  );
};

export default LanguageOptions;
