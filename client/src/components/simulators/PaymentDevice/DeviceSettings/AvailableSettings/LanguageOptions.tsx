
import { useContext } from 'react';
import { AppContext, Lang, SettingModes } from '../../utils/settingsReducer';
import Checkmark from '../checkmark/Checkmark';
import { Button, List } from './SettingModes';

const LanguageOptions = () => {
  const { state, dispatch } = useContext(AppContext);
  
  const onChangeEventHandler = (mode: Lang) => {
    dispatch({ type: SettingModes.LANGUAGE, payload: mode });
  };

  return (
    <List>
      {Object.values(Lang).map((language) => (
        <Button key={language} onClick={() => onChangeEventHandler(language)}>
          {language}
          <Checkmark isDisplayed={state.language === language }/>
        </Button>
      ))}
    </List>
  );
};

export default LanguageOptions;
