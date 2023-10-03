// types
import InputActionType from '../../enums/InputActionTypes';
import CardType from '../CardType';

type InputValueAction = { type: InputActionType.INPUT_VALUE, field: string, payload: string };
type SetIdAction = { type: InputActionType.SET_ID, payload: CardType };

type AddIdDispatchActions = InputValueAction | SetIdAction;

export default AddIdDispatchActions;
