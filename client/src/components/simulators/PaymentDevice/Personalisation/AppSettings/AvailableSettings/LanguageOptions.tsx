
import { LanguageOptionsStatesType, SettingModes, StateDispatchProps } from '../../../utils/settingsReducer';
import { Button, List } from "../../style";
import Checkmark from './checkmark';

const LanguageOptions = ({ state, dispatch }: StateDispatchProps) => {
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
