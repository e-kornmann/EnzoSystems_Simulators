import { SettingModes, StateDispatchProps } from '../../../utils/settingsReducer';

import { Button, List } from '../../style';

const PinOptions = ({ state, dispatch }: StateDispatchProps) => {
  const onChangeEventHandler = (askForPin: boolean) => {
    dispatch({ type: SettingModes.ASK_FOR_PIN, payload: askForPin });
  };

  return (
    <List>
      <Button key={'PinYes'} onClick={() => onChangeEventHandler(true)}>
        YES
        <input
          type="radio"
          id={'PinYes'}
          name="ask-for-pin"
          checked={state.askForPin === true}
          onChange={() => onChangeEventHandler(true)}
        />
      </Button>
      <Button key={'PinNo'} onClick={() => onChangeEventHandler(false)}>
        NO
        <input
          type="radio"
          id={'PinNo'}
          name="ask-for-pin"
          checked={state.askForPin === false}
          onChange={() => onChangeEventHandler(false)}
        />
      </Button>
    </List>
  );
};
export default PinOptions;
