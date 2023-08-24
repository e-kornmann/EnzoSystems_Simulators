import { memo, useCallback } from 'react';
import styled from 'styled-components';
import { QrCode } from '..';

const StyledWrapper = styled('div')(({ theme }) => ({
 backgroundColor: theme.colors.background.transparent,
 display: 'flex',
 height: '100%',
 left: 0,
 position: 'fixed',
 flexDirection: 'column',
 padding: '5%',
 top: 0,
 width: '100%',
 zIndex: '5',
 borderRadius: '5px',
 alignContent: 'flex-end',
}));

const StyledExplanation = styled('div')(({ theme }) => ({
 backgroundColor: theme.colors.background.primary,
 alignItems: 'center',
 color: theme.colors.text.primary,
 display: 'flex',
 fontSize: '0.62em',
 justifyContent: 'center',
 fontWeight: '500',
 height: '18px',
 borderRadius: '2px 2px 0 0',
 maxWidth: '600px',
 width: '100%'
}));

const StyledDeleteButton = styled('div')(({ theme }) => ({
 backgroundColor: theme.colors.background.primary,
 alignItems: 'center',
 borderTop: `1px solid ${theme.colors.border.primary}`,
 color: theme.colors.buttons.red,
 cursor: 'pointer',
 display: 'flex',
 height: '26px',
 fontSize: '0.92em',
 justifyContent: 'center',
 borderRadius: '0 0 2px 2px',
 maxWidth: '600px',
 width: '100%'
}));


const StyledCancelButton = styled(StyledDeleteButton)(({ theme }) => ({
 color: theme.colors.buttons.blue,
 borderTop: 'none',
 marginTop: '5px',
 borderRadius: '2px',
}));

type Props = {
  deleteQrCodesHandler: (qrCodesToDelete: QrCode[]) => void,
  toggleShowComponent: () => void,
  showComponent: boolean,
  selectedQrCodesForDeletion: QrCode[],
}

const DeleteDialogWrapper = ({ deleteQrCodesHandler, toggleShowComponent, showComponent, selectedQrCodesForDeletion}: Props) => {


    const deleteConfirmHandler = useCallback(()=> {
      deleteQrCodesHandler(selectedQrCodesForDeletion);
      toggleShowComponent();
    }, [deleteQrCodesHandler, selectedQrCodesForDeletion, toggleShowComponent]
    )
    return (

showComponent && 
   <StyledWrapper>
     
       
         <StyledExplanation>{ selectedQrCodesForDeletion.length > 1 ? 'These QR-codes will be deleted.' : 'This QR-code will be deleted.' }</StyledExplanation>
         <StyledDeleteButton onClick={deleteConfirmHandler}>Delete</StyledDeleteButton>
        
       
         <StyledCancelButton onClick={toggleShowComponent}>Cancel</StyledCancelButton>
       
     
   </StyledWrapper>

)
  }

export const DeleteDialog = memo(DeleteDialogWrapper);

