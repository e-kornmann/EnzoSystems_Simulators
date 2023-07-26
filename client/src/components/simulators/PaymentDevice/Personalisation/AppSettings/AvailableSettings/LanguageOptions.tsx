
import { LanguageOptionsStatesType, SettingModes, StateDispatchProps } from '../../../utils/settingsReducer';
import { Button, List } from "../../style";

const LanguageOptions = ({ state, dispatch }: StateDispatchProps) => {
  const onChangeEventHandler = (mode: LanguageOptionsStatesType) => {
    dispatch({ type: SettingModes.LANGUAGE, payload: mode });
  };

  return (
    <List>
      {Object.values(LanguageOptionsStatesType).map((language) => (
        <Button key={language} onClick={() => onChangeEventHandler(language)}>
          {language}
          <input
            type="radio"
            id={language}
            name="languages"
            checked={state.language === language}
            onChange={() => onChangeEventHandler(language)}
          />
        </Button>
      ))}
    </List>
  );
};

export default LanguageOptions;
