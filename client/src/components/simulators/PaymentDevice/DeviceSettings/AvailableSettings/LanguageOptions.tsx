
import { useContext } from 'react';
import { AppContext, Lang, SettingModes } from '../../utils/settingsReducer';
import Checkmark from '../checkmark/Checkmark';
import * as S from '../DeviceSettings';

const LanguageOptions = () => {
  const { state, dispatch } = useContext(AppContext);
  
  const onChangeEventHandler = (mode: Lang) => {
    dispatch({ type: SettingModes.LANGUAGE, payload: mode });
  };

  return (
    <S.List>
      {Object.values(Lang).map((language) => (
        <S.Button key={language} onClick={() => onChangeEventHandler(language)}>
          {language}
          <Checkmark isDisplayed={state.language === language }/>
        </S.Button>
      ))}
    </S.List>
  );
};

export default LanguageOptions;
