// types
import InputActionType from '../../enums/InputActionTypes';
import KeyType from '../KeyType';

type InputValueAction = { type: InputActionType.INPUT_VALUE, field: string, payload: string };
type SetIdAction = { type: InputActionType.SET_ID, payload: KeyType };

type AddIdDispatchActions = InputValueAction | SetIdAction;

export default AddIdDispatchActions;
