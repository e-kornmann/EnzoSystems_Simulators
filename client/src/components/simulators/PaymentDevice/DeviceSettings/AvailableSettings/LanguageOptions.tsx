
import { useContext } from 'react';
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import Checkmark from '../checkmark';
import * as S from '../../../../shared/DraggableModal/ModalTemplate';
import ts from '../../Translations/translations';

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
