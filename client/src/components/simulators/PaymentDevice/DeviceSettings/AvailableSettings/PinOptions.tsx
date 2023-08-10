import { useContext } from 'react';
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import * as S from '../../../../shared/DraggableModal/ModalTemplate';
import Checkmark from '../checkmark';
import ts from '../../Translations/translations';

const PinOptions = () => {

  const { state, dispatch } = useContext(AppContext);
  
  
  const onChangeEventHandler = (askForPin: boolean) => {
    dispatch({ type: SettingModes.ASK_FOR_PIN, payload: askForPin });
  };

  return (
    <S.GenericList>
      <S.GenericListButton key={'PinYes'} onClick={() => onChangeEventHandler(true)}>
      {ts('yes', state.language)}
        <Checkmark isDisplayed={ state.askForPin === true }/> 
      </S.GenericListButton>
      <S.GenericListButton key={'PinNo'} onClick={() => onChangeEventHandler(false)}>
      {ts('no', state.language)}
        <Checkmark isDisplayed={ state.askForPin === false }/> 
      </S.GenericListButton>
    </S.GenericList>
  );
};
export default PinOptions;