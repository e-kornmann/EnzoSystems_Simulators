import { ReactComponent as Expand } from '../local_assets/expand.svg';

type Props = {
  width: number;
  height: number;
};

const ExpandIcon = ({ width, height }: Props) => <Expand width={width} height={height}/>;

export default ExpandIcon;
