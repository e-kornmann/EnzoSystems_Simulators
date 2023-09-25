import { useContext } from 'react';
import PayProvider, { SupportedSchemesType } from '../../../../shared/PayProvider';
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import { ReactComponent as CloseIcon } from '../../../../../assets/svgs/close.svg';
import { SettingHeader, SettingsWrapper } from '../DeviceSettings';
import * as S from '../../../../shared/DraggableModal/ModalTemplate';
import { Wrap } from './SchemeOptions';
import ts from '../../Translations/translations';
import { SharedCheckMark } from '../../../../shared/CheckAndCrossIcon';

type Props = {
  hide: boolean;
  onHide: () => void;
};

const SelectScheme = ({ hide, onHide }: Props) => {
  const { state, dispatch } = useContext(AppContext);

  const onChangeEventHandler = (mode: SupportedSchemesType) => {
    dispatch({ type: SettingModes.SELECT_SCHEME, payload: mode });
    setTimeout(() => onHide(), 200);
  };

  return (
    <SettingsWrapper $hide={hide}>
      <S.SharedStyledContainer>
        <SettingHeader>
          <div>{null}</div>
          {ts('paymentMethod', state.language)}
          <CloseIcon width={11} height={11} onClick={onHide} />
        </SettingHeader>
        <S.SharedStyledList>
          {state.selectedSchemes.map(scheme => (
            <S.SharedStyledListButton key={scheme} onClick={() => onChangeEventHandler(scheme)}>
              <Wrap><PayProvider width={30} height={22} provider={scheme} border={false} />{scheme}</Wrap>
              <SharedCheckMark isDisplayed={ state.schemeInUse === scheme } width={14} height={11} />
            </S.SharedStyledListButton>
          ))}
        </S.SharedStyledList>
      </S.SharedStyledContainer>
    </SettingsWrapper>
  );
};

export default SelectScheme;
