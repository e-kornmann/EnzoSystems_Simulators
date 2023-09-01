import { useContext } from 'react';
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import * as S from '../../../../shared/DraggableModal/ModalTemplate';
import ts from '../../Translations/translations';
import { SharedCheckMark } from '../../../../shared/CheckAndCrossIcon';

export enum Lang {
  DUTCH = 'dutch',
  ENGLISH = 'english',
  GERMAN = 'german',
  FRENCH = 'french',
}

const LanguageOptions = () => {
  const { state, dispatch } = useContext(AppContext);

  const onChangeEventHandler = (mode: Lang) => {
    dispatch({ type: SettingModes.LANGUAGE, payload: mode });
  };

  return (
    <S.GenericList>
      {Object.values(Lang).map(language => (
        <S.GenericListButton key={language} onClick={() => onChangeEventHandler(language)}>
          { ts(language, state.language) }
          <SharedCheckMark isDisplayed={state.language === language} width={14} height={11} />
        </S.GenericListButton>
      ))}
    </S.GenericList>
  );
};

export default LanguageOptions;
