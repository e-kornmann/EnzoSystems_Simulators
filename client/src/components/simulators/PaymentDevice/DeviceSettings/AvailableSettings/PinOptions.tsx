import { useContext } from 'react';
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import { Button, List } from './SettingModes';
import Checkmark from '../checkmark/Checkmark';
import ts from '../../Translations/translations';

const PinOptions = () => {

  const { state, dispatch } = useContext(AppContext);
  
  
  const onChangeEventHandler = (askForPin: boolean) => {
    dispatch({ type: SettingModes.ASK_FOR_PIN, payload: askForPin });
  };

  return (
    <List>
      <Button key={'PinYes'} onClick={() => onChangeEventHandler(true)}>
      {ts('yes', state.language)}
        <Checkmark isDisplayed={ state.askForPin === true }/> 
      </Button>
      <Button key={'PinNo'} onClick={() => onChangeEventHandler(false)}>
      {ts('no', state.language)}
        <Checkmark isDisplayed={ state.askForPin === false }/> 
      </Button>
    </List>
  );
};
export default PinOptions;