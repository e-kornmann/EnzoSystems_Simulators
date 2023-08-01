import SuccessIcon from "../../../../../shared/svgcomponents/Success";
import * as Sv from "../../../../../../styles/stylevariables";

type Props = {
    isDisplayed: boolean;
}
const CheckMark = ({ isDisplayed }: Props) => isDisplayed ? <SuccessIcon width={14} height={14} fill={Sv.enzoOrange} /> : null

export default CheckMark;