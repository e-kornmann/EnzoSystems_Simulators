import { memo, useCallback, useContext } from 'react';
// styled components
import styled from 'styled-components';
// contexts
import AppDispatchContext from '../../contexts/dispatch/AppDispatchContext';
// svg images
import { ReactComponent as AddIdIcon } from '../../../local_assets/add_id.svg';
import { ReactComponent as IdsIcon } from '../../../local_assets/ids.svg';
import { ReactComponent as SettingsIcon } from '../../../local_assets/settings.svg';
// types
import ShowAddIdType from '../../types/ShowAddIdType';
import ActionType from '../../enums/ActionTypes';
import ShowIdType from '../../types/ShowIdType';
import { SharedStyledFooter } from '../../../local_shared/DraggableModal/ModalTemplate';

const StyledSettingsButton = styled('div')(({ theme }) => ({
  justifyContent: 'flex-start',
  '& > svg': {
    fill: theme.colors.text.primary,
  },
}));
const StyledKeysButton = styled('div')(({ theme }) => ({
  justifyContent: 'center',
  '& > svg': {
    fill: theme.colors.text.primary,
    marginBottom: '3px',
    marginRight: '-2px',
  },
}));
const StyledAddIdButton = styled('div')(({ theme }) => ({
  justifyContent: 'flex-end',
  '& > svg': {
    fill: theme.colors.text.primary,
    marginBottom: '3px',
  },
}));

type Props = {
  showAddKey: ShowAddIdType,
  showSettings: boolean,
  showIds: ShowIdType,
  saveButtonIsEnabled: boolean,
  deleteButtonIsEnabled: boolean,
  allIdsAreSelected: boolean,
  enableEditandDeleteButton: boolean,
};

const FooterComponent = ({
  showAddKey,
  showSettings,
  showIds,
  saveButtonIsEnabled,
  deleteButtonIsEnabled,
  allIdsAreSelected,
  enableEditandDeleteButton,
}: Props) => {
  const appDispatch = useContext(AppDispatchContext);

  const handleAddKey = useCallback(() => {
    appDispatch({ type: ActionType.SHOW_BACK, payload: true });
    appDispatch({ type: ActionType.SHOW_ADD_ID, payload: true });
  }, [appDispatch]);

  const handleSaveKey = useCallback(() => {
    appDispatch({ type: ActionType.SAVE_ID_CLICKED, payload: true });
  }, [appDispatch]);

  const handleToggleSettings = useCallback(() => {
    appDispatch({ type: ActionType.TOGGLE_SETTINGS });
  }, [appDispatch]);

  const handleViewKeys = useCallback(() => {
    appDispatch({ type: ActionType.SHOW_IDS, payload: true });
  }, [appDispatch]);

  const setToDeleteMode = useCallback(() => {
    appDispatch({ type: ActionType.SHOW_BACK, payload: true });
    appDispatch({ type: ActionType.DELETE_IDS_MODE, payload: true });
  }, [appDispatch]);

  const handleDeleteDialog = useCallback(() => {
    appDispatch({ type: ActionType.SHOW_DELETE_DIALOG, payload: true });
  }, [appDispatch]);

  const handleEditKey = useCallback(() => {
    appDispatch({ type: ActionType.SHOW_BACK, payload: true });
    appDispatch({ type: ActionType.EDIT_IDS_MODE, payload: true });
  }, [appDispatch]);

  const handleDeselectAllKey = useCallback(() => {
    appDispatch({ type: ActionType.DESELECT_ALL_ID_CLICKED, payload: true });
  }, [appDispatch]);

  const handleSelectAllKey = useCallback(() => {
    appDispatch({ type: ActionType.SELECT_ALL_ID_CLICKED, payload: true });
  }, [appDispatch]);

  return (
  <SharedStyledFooter>
        {(!showAddKey.showComponent && !showSettings && !showIds.showComponent)
          && <>
            <StyledSettingsButton onClick={handleToggleSettings}>
              <SettingsIcon width={16} height={16} />
            </StyledSettingsButton>
            <StyledKeysButton onClick={handleViewKeys}>
              <IdsIcon width={25} height={19} /> IDs
            </StyledKeysButton>
            <StyledAddIdButton onClick={handleAddKey}>
              <AddIdIcon width={25} height={19} />
            </StyledAddIdButton>
          </>
        }
        {showAddKey.showComponent
          && <button type="submit" onClick={handleSaveKey} style={{ marginLeft: 'auto' }} disabled={!saveButtonIsEnabled}>
            {!showAddKey.editMode ? 'Save' : 'Update'}
          </button>
        }
        {showIds.showComponent
          && <>
            {!showIds.editMode && !showIds.deleteMode
            && <>
              <button type="button" onClick={handleAddKey}>
                New</button>
              <button type="button" onClick={handleEditKey} disabled={!enableEditandDeleteButton} >
                Edit</button>
              <button type="button" onClick={setToDeleteMode} disabled={!enableEditandDeleteButton} >
                Delete</button>
            </>
            }
            {!showIds.editMode && showIds.deleteMode
            && <>
              <button type="button" onClick={() => (allIdsAreSelected ? handleDeselectAllKey() : handleSelectAllKey()) }>
                { allIdsAreSelected ? 'Deselect all' : 'Select all' }
              </button>
              <button type="button" onClick={handleDeleteDialog} disabled={!deleteButtonIsEnabled}>Delete</button>
            </>
            }

            {!showIds.deleteMode && showIds.editMode
            && <button disabled>Select ID to edit</button>
          }

          </>
        }
      </SharedStyledFooter>
  );
};

export const Footer = memo(FooterComponent);
