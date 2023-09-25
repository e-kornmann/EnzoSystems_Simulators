import { useContext } from 'react';
import { ReactComponent as Arrow } from '../../../../local_assets/arrow.svg';
import ts from '../../../Translations/translations';
import { AppContext, SettingModes } from '../../../utils/settingsReducer';
import * as S from '../../../../local_shared/DraggableModal/ModalTemplate';

type Props = {
  menuToggler: (listItem: SettingModes) => void;
};

const Settings = ({ menuToggler }: Props) => {
  const { state } = useContext(AppContext);

  return (
    <S.SharedStyledList>
      <S.SharedStyledListButtonWithArrow onClick={() => menuToggler(SettingModes.OPERATIONAL_MODE)} >{ts('status', state.language)}
        <Arrow /></S.SharedStyledListButtonWithArrow>
      <S.SharedStyledListButtonWithArrow onClick={() => menuToggler(SettingModes.LANGUAGE)} >{ts('defaultLanguage', state.language)}
        <Arrow /></S.SharedStyledListButtonWithArrow>
    </S.SharedStyledList>
  );
};

export default Settings;
