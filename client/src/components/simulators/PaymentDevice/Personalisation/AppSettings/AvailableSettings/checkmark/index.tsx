import SuccessIcon from "../../../../../../shared/svgcomponents/Success";
import * as Sv from "../../../../../../../styles/stylevariables";

type Props = {
    isDisplayed: boolean;
}

const CheckMark = ({ isDisplayed }: Props) => isDisplayed ? <SuccessIcon width={18} height={18} fill={Sv.enzoOrange} /> : null


export default CheckMark;