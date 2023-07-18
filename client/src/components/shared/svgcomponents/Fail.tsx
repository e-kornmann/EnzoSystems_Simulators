import { ReactComponent as Fail } from '../../../assets/svgs/fail.svg';
import { red } from '../stylevariables';


type Props = {
    width: number;
    height: number;
}

const FailureIcon = ({width, height}: Props) => <Fail width={width} height={height} fill={red} />;

export default FailureIcon;