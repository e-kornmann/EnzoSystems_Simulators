import { memo, useCallback, useContext } from 'react';
// styled components
import styled from 'styled-components';
// contexts
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';
// svg images
import { ReactComponent as AddKeyIcon } from '../../../images/add_key.svg';
import { ReactComponent as SettingsIcon } from '../../../images/settings.svg';

const StyledFooter = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.primary,
  display: 'grid',
  gridTemplateColumns: '40px 1fr 40px',
  height: '100%',
  padding: '8px 16px',
  width: '100%',
  zIndex: '2'
}));
const StyledButton = styled('div')({
  alignItems: 'center',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
  '& > svg': {
    height: '20px',
    width: '20px'
  }
});
const StyledSettingsButton = styled(StyledButton)({
  justifyContent: 'flex-start'
});
const StyledKeysButton = styled(StyledButton)({
});
const StyledAddKeyButton = styled(StyledButton)({
  justifyContent: 'flex-end'
});
// const StyledPlaceholder = styled.div``;

const Footer = ({ showSettings }) => {
  const appDispatch = useContext(AppDispatchContext);

  const handleAddKey = useCallback(() => {
    appDispatch({ type: 'add-key-local' });
  }, []);

  const handleToggleSettings = useCallback(() => {
    appDispatch({ type: 'toggle-settings' });
  }, []);

  return (
    <StyledFooter>
      <StyledSettingsButton onClick={() => { handleToggleSettings(); }}>
        <SettingsIcon />
      </StyledSettingsButton>
      <StyledKeysButton onClick={() => { }}>
        <AddKeyIcon /> Keys
      </StyledKeysButton>
      <StyledAddKeyButton onClick={() => { handleAddKey(); }}>
        <AddKeyIcon />
      </StyledAddKeyButton>
    </StyledFooter>
  );
};

export default memo(Footer);
