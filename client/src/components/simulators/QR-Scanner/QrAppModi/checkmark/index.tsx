import SuccessIcon from "../../../../shared/Success";


type Props = {
    isDisplayed: boolean;
    width: number;
    height: number;
    color: string
}

const CheckMark = ({ isDisplayed, width, height, color }: Props) => isDisplayed ? <SuccessIcon width={width} height={height} fill={color} /> : null




export default CheckMark;
