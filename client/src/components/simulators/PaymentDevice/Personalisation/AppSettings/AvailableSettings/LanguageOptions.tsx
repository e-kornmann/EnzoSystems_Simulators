
import { useContext } from 'react';
import { AppContext, LanguageOptionsStatesType, SettingModes } from '../../../utils/settingsReducer';
import Checkmark from '../checkmark';
import { Button, List } from './SettingModes';

const LanguageOptions = () => {
  const { state, dispatch } = useContext(AppContext);
  
  const onChangeEventHandler = (mode: LanguageOptionsStatesType) => {
    dispatch({ type: SettingModes.LANGUAGE, payload: mode });
  };

  return (
    <List>
      {Object.values(LanguageOptionsStatesType).map((language) => (
        <Button key={language} onClick={() => onChangeEventHandler(language)}>
          {language}
          <Checkmark isDisplayed={state.language === language }/>
        </Button>
      ))}
    </List>
  );
};

export default LanguageOptions;
