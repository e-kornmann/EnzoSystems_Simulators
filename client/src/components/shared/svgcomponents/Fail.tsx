import { ReactComponent as Fail } from '../../../assets/svgs/fail.svg';


type Props = {
    width: number;
    height: number;
}

const FailureIcon = ({width, height}: Props) => <Fail width={width} height={height}/>;

export default FailureIcon;