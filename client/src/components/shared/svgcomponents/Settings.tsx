import { ReactComponent as Settings } from '../../../assets/svgs/settings.svg';

type Props = {
    width: number;
    height: number;
}

const SettingsIcon = ({width, height}: Props) => <Settings width={width} height={height}/>;

export default SettingsIcon;