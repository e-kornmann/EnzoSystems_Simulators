import { memo } from 'react';
import styled from 'styled-components';
import { ReactComponent as CheckMarkIcon } from '../local_assets/checkmark.svg';
import { ReactComponent as CrossIcon } from '../local_assets/fail.svg';
import ShowIcon from '../local_types/ShowIcon';

type SuccessOrFailProps = {
  checkOrCrossIcon: ShowIcon | undefined;
  width: number;
  height: number;
};

const StyledSuccessOrFailIcon = styled('div')<({ $isSuccess: boolean })>(({ theme, $isSuccess }) => ({
  '& > svg': {
    fill: $isSuccess ? theme.colors.buttons.green : theme.colors.buttons.red,
  },
}));

const SuccesOrFailIcon = ({
  checkOrCrossIcon, width, height,
}: SuccessOrFailProps) => (
        <>
         { checkOrCrossIcon === ShowIcon.CHECK
            && <StyledSuccessOrFailIcon $isSuccess={true}>
                <CheckMarkIcon width={width} height={height} />
                </StyledSuccessOrFailIcon> }
         { checkOrCrossIcon === ShowIcon.CROSS && <StyledSuccessOrFailIcon $isSuccess={false}>
            <CrossIcon width={width} height={height} /></StyledSuccessOrFailIcon> }
         </>
);

export const SharedSuccesOrFailIcon = memo(SuccesOrFailIcon);
