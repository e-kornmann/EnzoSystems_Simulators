// types
import InputActionType from '../../enums/InputActionTypes';
import { IdType } from '../IdType';

type InputValueAction = { type: InputActionType.INPUT_VALUE, field: string, payload: string };
type SetIdAction = { type: InputActionType.SET_ID, payload: IdType };

type AddIdDispatchActions = InputValueAction | SetIdAction;

export default AddIdDispatchActions;
