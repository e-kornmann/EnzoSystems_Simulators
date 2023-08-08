import { useContext } from 'react';
import { AppContext, OperationalModeOptionsStatesType, SettingModes } from '../../utils/settingsReducer';
import * as S from '../../../../shared/DraggableModal/ModalTemplate';
import Checkmark from '../checkmark/Checkmark';
import ts from '../../Translations/translations';


const OperationalModeOptions = () => {
  const { state, dispatch } = useContext(AppContext);
  
  const onChangeEventHandler = (mode: OperationalModeOptionsStatesType) => {
    dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: mode });
  };

  return (
    <S.GenericList>
      {Object.values(OperationalModeOptionsStatesType).map((mode) => (
        <S.GenericListButton key={mode} onClick={() => onChangeEventHandler(mode)}>
          
          {ts(mode, state.language)}
           
          <Checkmark isDisplayed={state.operationalModeOption === mode }/> 
        </S.GenericListButton>
      ))}
    </S.GenericList>
  );
};

export default OperationalModeOptions;