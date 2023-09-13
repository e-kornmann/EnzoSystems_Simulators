import DeviceStatuses from '../../enums/DeviceStatuses';
import KeyType from '../PassPortType';
import ProcessStatuses from '../../enums/ProcessStatuses';
import SessionType from '../SessionType';
import TokenType from '../TokenType';
import ActionType from '../../enums/ActionTypes';

// All BooleanActions
type BooleanAction = {
  type:
  ActionType.CLICKED_BACK
  | ActionType.CLICKED_CROSS
  | ActionType.SHOW_ADD_KEY
  | ActionType.SHOW_BACK
  | ActionType.SHOW_CROSS
  | ActionType.SHOW_KEYS
  | ActionType.SET_DELETE_BUTTON
  | ActionType.SET_SAVE_BUTTON
  | ActionType.ALL_KEYS_ARE_SELECTED
  | ActionType.EDIT_KEY
  | ActionType.EDIT_KEYS_MODE
  | ActionType.DELETE_KEYS_MODE
  | ActionType.SET_SEND_NEXT_SESSION_REQUEST
  | ActionType.SAVE_KEY_CLICKED
  | ActionType.SELECT_ALL_KEY_CLICKED
  | ActionType.DESELECT_ALL_KEY_CLICKED
  | ActionType.SHOW_DELETE_DIALOG,
  payload: boolean
};

// Without Payload
type NoPayLoadAction = {
  type:
  ActionType.TOGGLE_SETTINGS
  | ActionType.CLICKED_CROSS
  | ActionType.DELETE_KEY_CLICKED
};

// RoomkeyActions
type RoomKeyAction = { type: ActionType.SAVE_KEY | ActionType.UPDATE_KEY | ActionType.SELECT_KEY, payload: KeyType };
type AllKeysAction = { type: ActionType.SET_ALL_LOCALKEYS, payload: KeyType[] }

// Status Actions
type SetDeviceStatusAction = { type: ActionType.SET_DEVICE_STATUS, payload: DeviceStatuses };
type SetProcessStatusAction = { type: ActionType.SET_PROCESS_STATUS, payload: ProcessStatuses };

// Other Actions
type SetHeaderTitleAction = { type: ActionType.SET_HEADER_TITLE, payload: string };
type SetSessionAction = { type: ActionType.SET_SESSION, payload: SessionType | null };
type SetTokensAction = { type: ActionType.SET_TOKENS, payload: TokenType | null };

type AppDispatchActions =
  BooleanAction
  | NoPayLoadAction
  | RoomKeyAction
  | SetDeviceStatusAction
  | SetHeaderTitleAction
  | SetProcessStatusAction
  | SetSessionAction
  | SetTokensAction
  | RoomKeyAction
  | AllKeysAction

export default AppDispatchActions;
