import { OperationalModeOptionsStatesType, SettingModes, StateDispatchProps } from '../../../utils/settingsReducer';
import { Button, List } from "../../style";



const OperationalModeOptions = ({ state, dispatch }: StateDispatchProps) => {
  const onChangeEventHandler = (mode: OperationalModeOptionsStatesType) => {
    dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: mode });
  };

  return (
    <List>
      {Object.values(OperationalModeOptionsStatesType).map(mode => (
        <Button key={mode} onClick={() => onChangeEventHandler(mode)}>
          {mode}
          <input
            type="radio"
            id={mode}
            name="currencies"
            checked={state.operationalModeOption === mode}
            onChange={() => onChangeEventHandler(mode)}
          />
        </Button>
      ))}
    </List>
  );
};

export default OperationalModeOptions;
