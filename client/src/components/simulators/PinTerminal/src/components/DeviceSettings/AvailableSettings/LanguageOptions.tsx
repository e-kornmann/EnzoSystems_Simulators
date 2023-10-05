import { memo, useContext } from 'react';
// contexts
import { AppContext, SettingModes } from '../../../utils/settingsReducer';
import * as S from '../../../../local_shared/DraggableModal/ModalTemplate';
import ts from '../../../Translations/translations';
import { ReactComponent as CheckMarkIcon } from '../../../../local_assets/checkmark.svg';

export enum Lang {
  DUTCH = 'dutch',
  ENGLISH = 'english',
  GERMAN = 'german',
  FRENCH = 'french',
}

const LanguageOptionsComponent = () => {
  const { state, dispatch } = useContext(AppContext);

  const onChangeEventHandler = (mode: Lang) => {
    dispatch({ type: SettingModes.LANGUAGE, payload: mode });
  };

  return (
    <S.SharedStyledList>
      {Object.values(Lang).map(language => (
        <S.SharedStyledListButton key={language} onClick={() => onChangeEventHandler(language)}>
          { ts(language, state.language) }
          {state.language === language && <CheckMarkIcon width={14} height={11} />}
        </S.SharedStyledListButton>
      ))}
    </S.SharedStyledList>
  );
};

export const LanguageOptions = memo(LanguageOptionsComponent);
