import { memo } from 'react';
import styled from 'styled-components';
// import { ReactComponent as CheckMarkIcon } from '../local_assets/check-mark.svg';
import { ReactComponent as CheckMarkIcon } from '../local_assets/checkmark.svg';
import { ReactComponent as CrossIcon } from '../local_assets/fail.svg';
import ShowIcon from '../local_types/ShowIcon';


type Props = {
  checkOrCrossIcon?: ShowIcon;
  isDisplayed?: boolean;
  width: number;
  height: number;
};

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

const CheckMark = ({ isDisplayed, width, height }: Props) => isDisplayed !== false
    && <CheckMarkIcon width={width} height={height} />;

const Cross = ({ width, height }: Props) => <CrossIcon width={width} height={height} />;

const SuccesOrFailIcon = ({
  checkOrCrossIcon, width, height,
}: SuccessOrFailProps) => (
        <>
         { checkOrCrossIcon === ShowIcon.CHECK
            && <StyledSuccessOrFailIcon $isSuccess={true}>
                <CheckMark width={width} height={height} />
                </StyledSuccessOrFailIcon> }
         { checkOrCrossIcon === ShowIcon.CROSS && <StyledSuccessOrFailIcon $isSuccess={false}>
            <Cross width={width} height={height} /></StyledSuccessOrFailIcon> }
         </>
);

export const SharedCheckMark = memo(CheckMark);
export const SharedCross = memo(Cross);
export const SharedSuccesOrFailIcon = memo(SuccesOrFailIcon);
