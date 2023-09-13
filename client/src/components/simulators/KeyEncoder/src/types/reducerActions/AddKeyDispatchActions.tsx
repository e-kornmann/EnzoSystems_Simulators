// types
import InputActionType from '../../enums/InputActionTypes';
import KeyType from '../KeyType';

type InputValueAction = { type: InputActionType.INPUT_VALUE | InputActionType.ADD_ROOMS, field: keyof KeyType, payload: string | string[] };
type SetKeyAction = { type: InputActionType.SET_KEY, payload: KeyType };
type SetTodayAction = { type: InputActionType.SET_TODAY, payload: string };
type SetTomorrowAction = { type: InputActionType.SET_TOMORROW, payload: string };

type AddKeyDispatchActions = InputValueAction | SetKeyAction | SetTodayAction | SetTomorrowAction;

export default AddKeyDispatchActions;
