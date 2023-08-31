import { memo } from 'react';
import { ReactComponent as CheckMarkIcon } from '../../assets/svgs/check-mark.svg';
import { ReactComponent as CrossIcon } from '../../assets/svgs/fail.svg';
import styled from 'styled-components';

type Props = {
    isSuccess?: boolean;
    isFailed?: boolean;
    isDisplayed?: boolean;
    width: number;
    height: number;
}

const StyledSuccessOrFailIcon = styled('div')<({ $isSuccess: boolean })>(({ theme, $isSuccess }) => ({
    '& > svg': {
    fill: $isSuccess ? theme.colors.buttons.green : theme.colors.buttons.red,
    }
}));

const CheckMark = ({ isDisplayed, width, height }: Props) => isDisplayed !== false && <CheckMarkIcon width={width} height={height} />
const Cross = ({ width, height }: Props) => <CrossIcon width={width} height={height} />

const SuccesOrFailIcon = ({ isFailed, isSuccess, width, height }: Props) => {
    return (
        <>
         { isSuccess && <StyledSuccessOrFailIcon $isSuccess={true}><CheckMark width={width} height={height} /></StyledSuccessOrFailIcon>  }
         { isFailed && <StyledSuccessOrFailIcon $isSuccess={false}><Cross width={width} height={height} /></StyledSuccessOrFailIcon> } 
         </>
)
    };

export const SharedCheckMark = memo(CheckMark); 
export const SharedCross = memo(Cross);
export const SharedSuccesOrFailIcon = memo(SuccesOrFailIcon); 




