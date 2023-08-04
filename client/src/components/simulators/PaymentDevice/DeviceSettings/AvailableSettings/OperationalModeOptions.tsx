import { useContext } from 'react';
import { AppContext, OperationalModeOptionsStatesType, SettingModes } from '../../utils/settingsReducer';
import * as S from '../DeviceSettings';
import Checkmark from '../checkmark/Checkmark';



const OperationalModeOptions = () => {
  const { state, dispatch } = useContext(AppContext);
  
  const onChangeEventHandler = (mode: OperationalModeOptionsStatesType) => {
    dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: mode });
  };

  return (
    <S.List>
      {Object.values(OperationalModeOptionsStatesType).map((mode) => (
        <S.Button key={mode} onClick={() => onChangeEventHandler(mode)}>
          {mode}
          <Checkmark isDisplayed={state.operationalModeOption === mode }/> 
        </S.Button>
      ))}
    </S.List>
  );
};

export default OperationalModeOptions;