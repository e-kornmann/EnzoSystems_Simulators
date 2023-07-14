import { ReactComponent as Expand } from '../../../assets/svgs/expand.svg';


type Props = {
    width: number;
    height: number;
}

const ExpandIcon = ({width, height}: Props) => <Expand width={width} height={height}/>;

export default ExpandIcon;