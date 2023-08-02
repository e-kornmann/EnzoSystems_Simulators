import { useContext } from 'react';
import { AppContext, OperationalModeOptionsStatesType, SettingModes } from '../../utils/settingsReducer';
import { Button, List } from './SettingModes';
import Checkmark from '../checkmark/Checkmark';



const OperationalModeOptions = () => {
  const { state, dispatch } = useContext(AppContext);
  
  const onChangeEventHandler = (mode: OperationalModeOptionsStatesType) => {
    dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: mode });
  };

  return (
    <List>
      {Object.values(OperationalModeOptionsStatesType).map((mode) => (
        <Button key={mode} onClick={() => onChangeEventHandler(mode)}>
          {mode}
          <Checkmark isDisplayed={state.operationalModeOption === mode }/> 
        </Button>
      ))}
    </List>
  );
};

export default OperationalModeOptions;