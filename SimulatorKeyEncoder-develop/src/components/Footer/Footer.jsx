import { memo, useCallback, useContext } from 'react';
// styled components
import styled from 'styled-components';
// contexts
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';
// svg images
import { ReactComponent as AddKeyIcon } from '../../../images/add_key.svg';
import { ReactComponent as KeysIcon } from '../../../images/keys.svg';
import { ReactComponent as SettingsIcon } from '../../../images/settings.svg';


const StyledSaveKeyButton = styled('div')({});
const StyledPlaceholder = styled.div``;

const StyledFooter = styled('footer')(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  padding: '6px 13px 10px',
  backgroundColor:  theme.colors.background.primary,

  '& > button': {
    display: 'flex',
    alignItems: 'top',
    padding: '2px',
    justifyContent: 'center',
    color: theme.colors.text.secondary,
    fontSize: '0.80em',
    cursor: 'pointer',
    '&:disabled': {
      color: theme.colors.buttons.gray,
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
    columnGap: '8px',
    alignItems: 'center',
    color: theme.colors.text.primary,
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
const StyledAddKeyButton = styled('div')(({ theme })=>({
  justifyContent: 'flex-end',
  "& > svg": {
  fill: theme.colors.text.primary,
  marginBottom: '3px',
  }
}));

const Footer = ({ showAddKey, showSettings }) => {
  const appDispatch = useContext(AppDispatchContext);

  const handleAddKey = useCallback(() => {
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

  return (
    <StyledFooter>
      
      {!showAddKey &&
        <>
          <StyledSettingsButton onClick={handleToggleSettings}>
            <SettingsIcon width={16} height={16} />
          </StyledSettingsButton>
          <StyledKeysButton onClick={handleViewKeys}>
            <KeysIcon  width={25} height={19}/> Keys
          </StyledKeysButton>
          <StyledAddKeyButton onClick={handleAddKey}>
            <AddKeyIcon width={25} height={19}/>
          </StyledAddKeyButton>
        </>}
      {showAddKey &&
        <>
          <StyledPlaceholder />
          <StyledSaveKeyButton onClick={handleSaveKey}>            Save
          </StyledSaveKeyButton>
          <StyledPlaceholder />
        </>}
    </StyledFooter>
  );
};

export default memo(Footer);
