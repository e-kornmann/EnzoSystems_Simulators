import { memo, useCallback, useContext } from 'react';
//import prop-types
import PropTypes from 'prop-types';
// styled components
import styled from 'styled-components';
// contexts
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';
// svg images
import { ReactComponent as AddKeyIcon } from '../../../images/add_key.svg';
import { ReactComponent as KeysIcon } from '../../../images/keys.svg';
import { ReactComponent as SettingsIcon } from '../../../images/settings.svg';


const StyledFooter = styled('footer')(({ theme }) => ({
  height: '40px',
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
  padding: '6px 13px 10px',
  backgroundColor: 'white',
  borderRadius: '0 0 5px 5px',
  '& > button': {
    display: 'flex',
    alignItems: 'top',
    padding: '2px',
    justifyContent: 'center',
    color: 'orange',
    fontSize: '0.80em',
    cursor: 'pointer',
    '&:disabled': {
      color: 'gray',
      cursor: 'inherit',
    }
  },
  '& > svg': {
    margin: '2px'
  },
  '& > div': {
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    columnGap: '8px',
    alignItems: 'center',
    color: 'asphalt',
    '&:first-of-type': {
      justifyContent: 'flex-start'
    },
    '&:last-of-type': {
      justifyContent: 'flex-end'
    },
    '& > svg': {
      fill: theme.colors.text.primary,
    }
  }
}));

const StyledSettingsButton = styled('div')(({ theme }) => ({
  justifyContent: 'flex-start',
  "& > svg": {
    fill: theme.colors.text.primary
  }
}));
const StyledKeysButton = styled('div')(({ theme }) => ({
  justifyContent: 'center',
  "& > svg": {
    fill: theme.colors.text.primary,
    marginBottom: '3px',
    marginRight: '-2px',
  }
}));
const StyledAddKeyButton = styled('div')(({ theme }) => ({
  justifyContent: 'flex-end',
  "& > svg": {
    fill: theme.colors.text.primary,
    marginBottom: '3px',
  }
}));

const FooterWithNavigation = ({ 
  showAddKey,
  showSettings,
  showKeys,
  saveButtonIsEnabled,
  deleteButtonIsEnabled,
  allKeysAreSelected,
  enableEditandDeleteButton
}) => {
  const appDispatch = useContext(AppDispatchContext);

  const handleAddKey = useCallback(() => {
    appDispatch({ type: 'show-back', payload: true });
    appDispatch({ type: 'show-add-key', payload: true });
  }, [appDispatch]);

  const handleSaveKey = useCallback(() => {
    appDispatch({ type: 'save-key-clicked', payload: true });
  }, [appDispatch]);

  const handleToggleSettings = useCallback(() => {
    appDispatch({ type: 'toggle-settings' });
  }, [appDispatch]);

  const handleViewKeys = useCallback(() => {
    appDispatch({ type: 'show-keys', payload: true });
  }, [appDispatch]);

  const setToDeleteMode =  useCallback(() => {
    appDispatch({ type: 'show-back', payload: true });
    appDispatch({ type: 'delete-keys-mode', payload: true });
  }, [appDispatch]);

  const handleDeleteDialog = useCallback(() => {
    appDispatch({ type: 'show-delete-dialog', payload: true });
  }, [appDispatch]);

  const handleEditKey = useCallback(() => {
    appDispatch({ type: 'show-back', payload: true });
    appDispatch({ type: 'edit-keys-mode', payload: true });
  }, [appDispatch]);

  const handleDeselectAllKey = useCallback(() => {
    appDispatch({ type: 'deselect-all-key-clicked', payload: true});
  }, [appDispatch]);

  const handleSelectAllKey = useCallback(() => {
    appDispatch({ type: 'select-all-key-clicked', payload: true});
  }, [appDispatch]);

  return (
    <>
      <StyledFooter>

        {(!showAddKey.showComponent  && !showSettings && !showKeys.showComponent ) &&
          <>
            <StyledSettingsButton onClick={handleToggleSettings}>
              <SettingsIcon width={16} height={16} />
            </StyledSettingsButton>
            <StyledKeysButton onClick={handleViewKeys}>
              <KeysIcon width={25} height={19} /> Keys
            </StyledKeysButton>
            <StyledAddKeyButton onClick={handleAddKey}>
              <AddKeyIcon width={25} height={19} />
            </StyledAddKeyButton>
          </>
        }
        {showAddKey.showComponent &&
          <button type="submit" onClick={handleSaveKey} style={{ marginLeft: 'auto' }} disabled={saveButtonIsEnabled}>
            {!showAddKey.editMode ? 'Save' : 'Update'}
          </button>
        }
        {showKeys.showComponent &&
          <>
            {!showKeys.editMode && !showKeys.deleteMode && 
            <>
              <button type="button" onClick={handleAddKey}>
                New</button>
              <button type="button" onClick={handleEditKey} disabled={enableEditandDeleteButton} >
                Edit</button>
              <button type="button" onClick={setToDeleteMode} disabled={enableEditandDeleteButton} >
                Delete</button>
            </>
            }
            {!showKeys.editMode && showKeys.deleteMode &&
            <>
              <button type="button" onClick={()=> allKeysAreSelected ? handleDeselectAllKey() : handleSelectAllKey() }>{ allKeysAreSelected ? 'Deselect all' : 'Select all' }</button>
              <button type="button" onClick={handleDeleteDialog} disabled={!deleteButtonIsEnabled}>Delete</button>
            </>
            }

            {!showKeys.deleteMode && showKeys.editMode &&
            <button disabled>Select key to edit</button>
          }
            
    
          </>
        }
      </StyledFooter>
    </>
  );
};

const Footer = memo(FooterWithNavigation)
export default Footer;

// Props
FooterWithNavigation.propTypes = {
  showAddKey: PropTypes.object,
  showSettings: PropTypes.bool,
  showKeys: PropTypes.object,
  saveButtonIsEnabled: PropTypes.bool,
  deleteButtonIsEnabled: PropTypes.bool,
  allKeysAreSelected: PropTypes.bool,
  enableEditandDeleteButton: PropTypes.bool,
}

