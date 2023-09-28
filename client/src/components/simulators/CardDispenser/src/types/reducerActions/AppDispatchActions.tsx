import ActionType from '../../enums/ActionTypes';
import { IdType } from '../IdType';

// All BooleanActions
type BooleanAction = {
  type:
  ActionType.CLICKED_BACK
  | ActionType.CLICKED_CROSS
  | ActionType.SHOW_ADD_ID
  | ActionType.SHOW_BACK
  | ActionType.SHOW_CROSS
  | ActionType.SHOW_IDS
  | ActionType.SET_DELETE_BUTTON
  | ActionType.SET_SAVE_BUTTON
  | ActionType.ALL_IDS_ARE_SELECTED
  | ActionType.EDIT_ID
  | ActionType.EDIT_IDS_MODE
  | ActionType.DELETE_IDS_MODE
  | ActionType.SAVE_ID_CLICKED
  | ActionType.SELECT_ALL_ID_CLICKED
  | ActionType.DESELECT_ALL_ID_CLICKED
  | ActionType.SHOW_DELETE_DIALOG,
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
  | ActionType.CLICKED_CROSS
  | ActionType.DELETE_ID_CLICKED
};

// IdActions
type IdAction = { type: ActionType.SAVE_ID | ActionType.UPDATE_ID | ActionType.SELECT_ID, payload: IdType };
type AllIdsAction = { type: ActionType.SET_ALL_LOCALIDS, payload: IdType[] };

type AppDispatchActions =
  BooleanAction
  | NoPayLoadAction
  | IdAction
  | StringAction
  | AllIdsAction;

export default AppDispatchActions;
