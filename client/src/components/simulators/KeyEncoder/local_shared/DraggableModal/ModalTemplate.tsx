import styled from 'styled-components';

export const SharedStyledContainer = styled('div')<{ $isDraggable: boolean }>(({ theme, $isDraggable }) => ({
  display: 'grid',
  gridTemplateRows: '35px 1fr',
  fontSize: '13px',
  height: $isDraggable ? '100%' : '100vh',
  width: $isDraggable ? '100%' : '100vw',
  minHeight: '420px',
  backgroundColor: theme.colors.background.secondary,
  borderRadius: '5px',
}));

export const SharedStyledHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  padding: '0 8px 0 9px',
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: '500',
  borderTopLeftRadius: '5px',
  borderTopRightRadius: '5px',
  backgroundColor: theme.colors.background.primary,
  color: theme.colors.text.secondary,
  '& > button': {
    cursor: 'pointer',
    width: '13px',
    height: '13px',
    display: 'grid',
    alignItems: 'flex-end',
    '& > svg': {
      fill: theme.colors.text.secondary,
    },
  },
}));

export const SharedStyledCheckBox = styled('div')<{ $isSelected: boolean }>(
  ({ $isSelected, theme }) => ({
    display: 'flex',
    alignItems: 'center',
    width: '12px',
    height: '12px',
    border: `1px solid ${$isSelected
      ? theme.colors.text.secondary
      : theme.colors.text.primary}`,
    borderRadius: '1px',
    cursor: 'pointer',
    backgroundColor: $isSelected
      ? theme.colors.text.secondary
      : theme.colors.background.primary,
    '& > svg': {
      marginLeft: '1px',
      fill: $isSelected ? theme.colors.text.primary : 'transparent',
    },
  }),
);

export const SharedStyledFooter = styled('footer')(({ theme }) => ({
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
    },
  },
  '& > svg': {
    margin: '2px',
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
      justifyContent: 'flex-start',
    },
    '&:last-of-type': {
      justifyContent: 'flex-end',
    },
    '& > svg': {
      fill: theme.colors.text.primary,
    },
  },
}));

export const SharedStyledList = styled('div')({
  padding: '2px 0',
  display: 'flex',
  flexDirection: 'column',
  borderBottomLeftRadius: '5px',
  borderBottomRightRadius: '5px',
  height: '100%',
  overflowY: 'scroll',
});

export const SharedStyledListButton = styled('button')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  cursor: 'pointer',
  textAlign: 'left',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '0.13em solid',
  borderColor: theme.colors.buttons.lightgray,
  width: '100%',
  height: '40px',
  fontSize: '0.9em',
  padding: '11px',
  columnGap: '20px',
  fill: theme.colors.text.secondary,
  '& > svg': {
    minWidth: '14px',
  },
  '& > span': {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    maxWidth: '82%',
  },
  '&:active': {
    backgroundColor: theme.colors.buttons.specialTransparent,
    fill: 'orange',
  },
}));

export const SharedStyledListButtonWithArrow = styled(SharedStyledListButton)(({ theme }) => ({
  '& > svg': {
    width: '14px',
    height: '11px',
    fill: theme.colors.text.primary,
  },
}));
