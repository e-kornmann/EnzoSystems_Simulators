// types
import InputActionType from '../../enums/InputActionTypes';
import { KeyData, KeyType } from '../KeyType';

type InputArrayValueAction = { type: InputActionType.INPUT_ARRAY_VALUE, field: keyof KeyData, payload: string[] };
type IdAction = { type: InputActionType.ID_VALUE, field: keyof KeyType, payload: string };
type InputValueAction = { type: InputActionType.INPUT_VALUE | InputActionType.ADD_ROOMS, field: keyof KeyData, payload: string };
type SetKeyAction = { type: InputActionType.SET_KEY, payload: KeyType };
type SetTodayAction = { type: InputActionType.SET_TODAY, payload: string };
type SetTomorrowAction = { type: InputActionType.SET_TOMORROW, payload: string };

type AddKeyDispatchActions = InputArrayValueAction | IdAction | InputValueAction | SetKeyAction | SetTodayAction | SetTomorrowAction;


export default AddKeyDispatchActions;