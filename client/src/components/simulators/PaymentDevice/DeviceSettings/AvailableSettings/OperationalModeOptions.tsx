import { useContext } from 'react';
<<<<<<< HEAD:client/src/components/simulators/PaymentDevice/Personalisation/AppSettings/AvailableSettings/OperationalModeOptions.tsx
import { AppContext, OperationalModeOptionsStatesType, SettingModes } from '../../../utils/settingsReducer';
import { Button, List } from './SettingModes';
import Checkmark from '../checkmark';
=======
import { AppContext, OperationalModeOptionsStatesType, SettingModes } from '../../utils/settingsReducer';
import { Button, List } from './SettingModes';
import Checkmark from '../checkmark/Checkmark';
>>>>>>> 109a59d764cc376814feed24b47e1f735bb51ca3:client/src/components/simulators/PaymentDevice/DeviceSettings/AvailableSettings/OperationalModeOptions.tsx



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
