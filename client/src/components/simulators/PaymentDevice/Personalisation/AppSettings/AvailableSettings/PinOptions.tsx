import { SettingModes, StateDispatchProps } from '../../../utils/settingsReducer';

import { Button, List } from '../../style';
import Checkmark from './checkmark';

const PinOptions = ({ state, dispatch }: StateDispatchProps) => {
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
