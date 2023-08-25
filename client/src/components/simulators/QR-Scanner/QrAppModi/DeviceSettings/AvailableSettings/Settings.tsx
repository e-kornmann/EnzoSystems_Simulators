

import { useContext } from 'react';
import { ReactComponent as Arrow } from '../../../../../../assets/svgs/arrow.svg';
import ts from '../../../Translations/translations';
import { AppContext, SettingModes } from '../../../utils/settingsReducer';
import * as S from '../../../../../shared/DraggableModal/ModalTemplate';


type Props = {
  menuToggler: (listItem: SettingModes) => void;
}

const Settings = ({menuToggler}: Props) => {
  const { state } = useContext(AppContext);
  
  return (
<S.GenericList>
  <S.GenericListButton onClick={() => menuToggler(SettingModes.OPERATIONAL_MODE)} >{ts('status', state.language)}<Arrow height={11} /></S.GenericListButton>
  <S.GenericListButton onClick={() => menuToggler(SettingModes.LANGUAGE)} >{ts('defaultLanguage', state.language)}<Arrow height={11}/></S.GenericListButton>
</S.GenericList>
)}

export default Settings;