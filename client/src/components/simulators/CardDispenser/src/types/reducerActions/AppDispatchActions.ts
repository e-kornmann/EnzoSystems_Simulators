import AppActions from '../../enums/AppActions';
import CardType from '../CardType';

// All BooleanActions
type BooleanAction = {
  type:
  AppActions.CLICKED_BACK
  | AppActions.CLICKED_CROSS
  | AppActions.SHOW_BACK
  | AppActions.SHOW_CROSS
  payload: boolean
};

// All string Actions
type StringAction = {
  type:
  AppActions.SET_HEADER_TITLE,
  payload: string
};

// stack Actions
type NumberActions = {
  type:
  AppActions.SET_CARDSTACK
  | AppActions.SET_BINSTACK,
  payload: number
};

// Without Payload
type NoPayLoadAction = {
  type:
  AppActions.TOGGLE_SETTINGS
  | AppActions.SHOW_BIN_SETTINGS
  | AppActions.SHOW_STACK_SETTINGS
  | AppActions.CLICKED_CROSS
};

// CardActions
type CardAction = { type: AppActions.RECEIVE_CARD_DATA, payload: CardType };

type AppDispatchActions =
  BooleanAction
  | NoPayLoadAction
  | StringAction
  | NumberActions
  | CardAction;

export default AppDispatchActions;
