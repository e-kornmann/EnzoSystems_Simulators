import DeviceStatuses from '../../enums/DeviceStatuses';
import ProcessStatuses from '../../enums/ProcessStatuses';
import TokenType from '../TokenType';
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
  | ActionType.SET_CLICKED_SETTING
  | ActionType.SET_SEND_NEXT_SESSION_REQUEST
  | ActionType.SAVE_ID_CLICKED
  | ActionType.SELECT_ALL_ID_CLICKED
  | ActionType.DESELECT_ALL_ID_CLICKED
  | ActionType.SHOW_DELETE_DIALOG,
  payload: boolean
};

// Without Payload
type NoPayLoadAction = {
  type:
  ActionType.TOGGLE_SETTINGS
  | ActionType.CLICKED_CROSS
  | ActionType.DELETE_ID_CLICKED
};

// RoomkeyActions
type RoomKeyAction = { type: ActionType.SAVE_ID | ActionType.UPDATE_ID | ActionType.SELECT_ID, payload: IdType };
type AllKeysAction = { type: ActionType.SET_ALL_LOCALIDS, payload: IdType[] };

// Status Actions
type SetDeviceStatusAction = { type: ActionType.SET_DEVICE_STATUS, payload: DeviceStatuses };
type SetProcessStatusAction = { type: ActionType.SET_PROCESS_STATUS, payload: ProcessStatuses };

// Other Actions
type SetHeaderTitleAction = { type: ActionType.SET_HEADER_TITLE, payload: string };
type SetTokensAction = { type: ActionType.SET_TOKENS, payload: TokenType | null };

type AppDispatchActions =
  BooleanAction
  | NoPayLoadAction
  | RoomKeyAction
  | SetDeviceStatusAction
  | SetHeaderTitleAction
  | SetProcessStatusAction
  | SetTokensAction
  | RoomKeyAction
  | AllKeysAction;

export default AppDispatchActions;
