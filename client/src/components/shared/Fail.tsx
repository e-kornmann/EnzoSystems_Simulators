import { ReactComponent as Cross } from '../../assets/svgs/fail.svg';

type Props = {
    width: number;
    height: number;
    fill: string;
}

const CrossIcon = ({width, height, fill}: Props) => <Cross width={width} height={height} fill={fill} />;

export default CrossIcon;
