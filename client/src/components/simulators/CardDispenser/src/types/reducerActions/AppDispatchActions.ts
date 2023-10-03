import ActionType from '../../enums/ActionTypes';
import CardType from '../CardType';

// All BooleanActions
type BooleanAction = {
  type:
  ActionType.CLICKED_BACK
  | ActionType.CLICKED_CROSS
  | ActionType.SHOW_BACK
  | ActionType.SHOW_CROSS
  payload: boolean
};

// All string Actions
type StringAction = {
  type:
  ActionType.SET_HEADER_TITLE,
  payload: string
};

// Without Payload
type NoPayLoadAction = {
  type:
  ActionType.TOGGLE_SETTINGS
  | ActionType.SHOW_BIN_SETTINGS
  | ActionType.SHOW_STACK_SETTINGS
  | ActionType.CLICKED_CROSS
};

// KeyActions
type KeyAction = { type: ActionType.RECEIVE_KEY_DATA, payload: CardType };

type AppDispatchActions =
  BooleanAction
  | NoPayLoadAction
  | StringAction
  | KeyAction;

export default AppDispatchActions;
