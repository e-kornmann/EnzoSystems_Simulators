import { memo, useCallback, useContext } from 'react';
import styled from 'styled-components';
import AppDispatchContext from '../../contexts/dispatch/appDispatchContext';

const StyledWrapper = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.transparent,
  display: 'flex',
  height: '100%',
  position: 'fixed',
  left: 0,
  top: 0,
  flexDirection: 'column',
  padding: '9% 5%',
  width: '100%',
  zIndex: '15',
  borderRadius: '5px',
  alignItems: 'center',
  justifyContent: 'flex-end',
}));

const StyledExplanation = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.primary,
  alignItems: 'center',
  color: theme.colors.text.primary,
  display: 'flex',
  fontSize: '0.65em',
  justifyContent: 'center',
  fontWeight: '500',
  height: '19px',
  borderRadius: '2px 2px 0 0',
  maxWidth: '600px',
  width: '100%',
}));

const StyledDeleteButton = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.primary,
  alignItems: 'center',
  borderTop: `1px solid ${theme.colors.border.primary}`,
  color: theme.colors.buttons.red,
  cursor: 'pointer',
  display: 'flex',
  height: '29px',
  fontSize: '0.95em',
  justifyContent: 'center',
  borderRadius: '0 0 2px 2px',
  maxWidth: '600px',
  width: '100%',
}));

const StyledCancelButton = styled(StyledDeleteButton)(({ theme }) => ({
  color: theme.colors.buttons.blue,
  borderTop: 'none',
  marginTop: '7px',
  borderRadius: '2px',
}));



const DeleteDialogWrapper = () => {
  const appDispatch = useContext(AppDispatchContext);

  const handleClickCancel = useCallback(() => {
      appDispatch({ type: 'show-delete-dialog', payload: false });
    }, [appDispatch]);
  


  return (

    <StyledWrapper>
    <StyledExplanation>
        This Key will be deleted.
      </StyledExplanation>
      <StyledDeleteButton >Delete</StyledDeleteButton>
      <StyledCancelButton type="button" onClick={handleClickCancel}>Cancel</StyledCancelButton>
    </StyledWrapper>

  );
};

const DeleteDialog = memo(DeleteDialogWrapper);

export default DeleteDialog;