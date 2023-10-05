import { memo, useContext } from 'react';
// context
import { AppContext, SettingModes } from '../../../utils/settingsReducer';
// shared components
import * as S from '../../../../local_shared/DraggableModal/ModalTemplate';
// components
import { SettingsWrapper } from '../DeviceSettings';
import { Wrap } from './SchemeOptions';
import { PayProvider } from '../../../components/PayProviders/PayProvider';
// svgs
import { ReactComponent as CloseIcon } from '../../../../local_assets/close.svg';
import { ReactComponent as CheckMarkIcon } from '../../../../local_assets/checkmark.svg';
// enums
import { SupportedSchemesType } from '../../../enums/SupportedSchemes';
// translations
import ts from '../../../Translations/translations';

type Props = {
  hide: boolean;
  onHide: () => void;
};

const SelectSchemeComponent = ({ hide, onHide }: Props) => {
  const { state, dispatch } = useContext(AppContext);

  const onChangeEventHandler = (mode: SupportedSchemesType) => {
    dispatch({ type: SettingModes.SELECT_SCHEME, payload: mode });
    setTimeout(() => onHide(), 200);
  };

  return (
    <SettingsWrapper $hide={hide}>
      <S.SharedStyledContainer>
        <S.SharedStyledHeader>
          <div>{null}</div>
          {ts('paymentMethod', state.language)}
          <CloseIcon width={11} height={11} onClick={onHide} />
        </S.SharedStyledHeader>
        <S.SharedStyledList>
          {state.selectedSchemes.map(scheme => (
            <S.SharedStyledListButton key={scheme} onClick={() => onChangeEventHandler(scheme)}>
              <Wrap><PayProvider width={30} height={22} provider={scheme} border={false} />{scheme}</Wrap>
              { state.schemeInUse === scheme && <CheckMarkIcon width={14} height={11} /> }
            </S.SharedStyledListButton>
          ))}
        </S.SharedStyledList>
      </S.SharedStyledContainer>
    </SettingsWrapper>
  );
};

export const SelectScheme = memo(SelectSchemeComponent);
