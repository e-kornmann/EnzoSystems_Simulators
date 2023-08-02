import { ReactComponent as Success } from '../../assets/svgs/success.svg';

type Props = {
    width: number;
    height: number;
    fill: string;
}

const SuccessIcon = ({width, height, fill}: Props) => <Success width={width} height={height} fill={fill} />;

export default SuccessIcon;