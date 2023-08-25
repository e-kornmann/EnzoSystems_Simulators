
import { useContext } from 'react';
import { AppContext, SettingModes } from '../../../utils/settingsReducer';
import Checkmark from '../../checkmark';
import * as S from '../../../../../shared/DraggableModal/ModalTemplate';
import * as Sv from '../../../../../../styles/stylevariables';

import { ReactComponent as Arrow } from '../../../../../../assets/svgs/arrow_back.svg';
import { ArrowWrapper } from '../DeviceSettings';
import ts from '../../../Translations/translations';



enum LangEnum {
  DUTCH = 'dutch',
  ENGLISH = 'english',
}

type Props = {
  arrowBackButtonHandler: () => void;
};

const LanguageOptions = ({arrowBackButtonHandler}: Props) => {
  const { state, dispatch } = useContext(AppContext);
  
  const onChangeEventHandler = (mode: LangEnum) => {
    dispatch({ type: SettingModes.LANGUAGE, payload: mode });
  };

  return (
    <S.GenericList>

      <ArrowWrapper onClick={arrowBackButtonHandler} >
       <Arrow width={12} height={12} />
      </ArrowWrapper>
      {Object.values(LangEnum).map((language) => (
        <S.GenericListButton key={language} onClick={() => onChangeEventHandler(language)}>
          { ts(language, state.language) }
          <Checkmark isDisplayed={state.language === language } width={14} height={11} color={Sv.enzoOrange} />
        </S.GenericListButton>
      ))}
    </S.GenericList>
  );
};

export default LanguageOptions;
