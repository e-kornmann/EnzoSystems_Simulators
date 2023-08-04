import { useContext } from 'react';
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import * as S from '../DeviceSettings';
import Checkmark from '../checkmark/Checkmark';
import ts from '../../Translations/translations';

const PinOptions = () => {

  const { state, dispatch } = useContext(AppContext);
  
  
  const onChangeEventHandler = (askForPin: boolean) => {
    dispatch({ type: SettingModes.ASK_FOR_PIN, payload: askForPin });
  };

  return (
    <S.List>
      <S.Button key={'PinYes'} onClick={() => onChangeEventHandler(true)}>
      {ts('yes', state.language)}
        <Checkmark isDisplayed={ state.askForPin === true }/> 
      </S.Button>
      <S.Button key={'PinNo'} onClick={() => onChangeEventHandler(false)}>
      {ts('no', state.language)}
        <Checkmark isDisplayed={ state.askForPin === false }/> 
      </S.Button>
    </S.List>
  );
};
export default PinOptions;