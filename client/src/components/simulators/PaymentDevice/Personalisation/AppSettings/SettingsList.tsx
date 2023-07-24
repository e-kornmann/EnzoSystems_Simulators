

import { ReactComponent as Arrow } from '../../../../../assets/svgs/arrow.svg';
import { SettingModes } from '../../utils/settingsReducer';
import { Button, List } from "../style";


type Props = {
  menuToggler: (listItem: SettingModes) => void;
}

const SettingsList = ({menuToggler}: Props) => {
  return (
<>
<List>
  <Button onClick={() => menuToggler(SettingModes.OPERATIONAL_MODE)} >Operational Mode<Arrow/></Button>
  <Button onClick={() => menuToggler(SettingModes.CURRENCY)} >Currency<Arrow/></Button>
  <Button onClick={() => menuToggler(SettingModes.LANGUAGE)} >Default Language<Arrow/></Button>
  <Button onClick={() => menuToggler(SettingModes.ASK_FOR_PIN)} >Ask for PIN<Arrow/></Button>
  <Button onClick={() => menuToggler(SettingModes.SCHEMES)} >Supported Schemes<Arrow/></Button>
</List>
</>
)}


export default SettingsList;