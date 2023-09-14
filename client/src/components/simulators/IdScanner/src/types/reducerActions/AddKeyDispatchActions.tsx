// types
import InputActionType from '../../enums/InputActionTypes';
import { PassPort } from '../PassPortType';

type InputValueAction = { type: InputActionType.INPUT_VALUE | InputActionType.ADD_ROOMS, field: keyof PassPort, payload: string | string[] };
type SetKeyAction = { type: InputActionType.SET_ID, payload: PassPort };
type SetTodayAction = { type: InputActionType.SET_TODAY, payload: string };
type SetTomorrowAction = { type: InputActionType.SET_TOMORROW, payload: string };

type AddKeyDispatchActions = InputValueAction | SetKeyAction | SetTodayAction | SetTomorrowAction;

export default AddKeyDispatchActions;
