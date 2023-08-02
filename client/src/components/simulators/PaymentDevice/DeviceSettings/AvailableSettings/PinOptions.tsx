import { useContext } from 'react';
<<<<<<< HEAD:client/src/components/simulators/PaymentDevice/Personalisation/AppSettings/AvailableSettings/PinOptions.tsx
import { AppContext, SettingModes } from '../../../utils/settingsReducer';
import { Button, List } from './SettingModes';
import Checkmark from '../checkmark';
=======
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import { Button, List } from './SettingModes';
import Checkmark from '../checkmark/Checkmark';
>>>>>>> 109a59d764cc376814feed24b47e1f735bb51ca3:client/src/components/simulators/PaymentDevice/DeviceSettings/AvailableSettings/PinOptions.tsx

const PinOptions = () => {

  const { state, dispatch } = useContext(AppContext);
  
  
  const onChangeEventHandler = (askForPin: boolean) => {
    dispatch({ type: SettingModes.ASK_FOR_PIN, payload: askForPin });
  };

  return (
    <List>
      <Button key={'PinYes'} onClick={() => onChangeEventHandler(true)}>
        YES
        <Checkmark isDisplayed={ state.askForPin === true }/> 
      </Button>
      <Button key={'PinNo'} onClick={() => onChangeEventHandler(false)}>
        NO
        <Checkmark isDisplayed={ state.askForPin === false }/> 
      </Button>
    </List>
  );
};
export default PinOptions;
