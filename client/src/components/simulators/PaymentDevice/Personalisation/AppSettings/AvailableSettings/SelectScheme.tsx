

import PayProvider from '../../../../../shared/svgcomponents/PayProviders/PayProvider';
import * as S from '../../../styles';
import { AllAppSettings, SettingModes, SettingsAction, SupportedSchemesType } from '../../../utils/settingsReducer';
import { Button, IconContainer, List, SettingHeader, SettingsWrapper, Wrap } from "../../style";
import { ReactComponent as CloseIcon } from '../../../../../../assets/svgs/close.svg';

type Props = {
  hide: boolean;
  onHide: () => void;
  state: AllAppSettings;
  dispatch: React.Dispatch<SettingsAction>
};

const SelectScheme = ({ hide, onHide, state, dispatch }: Props) => {

  const onChangeEventHandler = (mode: SupportedSchemesType) => {
    dispatch({ type: SettingModes.SELECT_SCHEME, payload: mode });
    setTimeout(()=>onHide(), 50);
  };

  return (

    <SettingsWrapper $hide={hide}>
      <S.Container>
        <SettingHeader>
          <IconContainer>{null}</IconContainer>
          Payment Methods
          <IconContainer onClick={onHide} style={{ cursor: 'pointer' }}><CloseIcon width={16} height={16} /></IconContainer>
        </SettingHeader>
        <List>
          {state.availableSchemes.map(scheme => (
            <Button key={scheme} onClick={() => onChangeEventHandler(scheme)}>
              <Wrap><PayProvider width={48} height={28} provider={scheme} />{scheme}</Wrap>
              <input
                type="radio"
                id={`${scheme}-select`}
                name="scheme-select"
                checked={state.selectedScheme === scheme}
                onChange={() => onChangeEventHandler(scheme)}
              />
            </Button>
          ))}
        </List>
      </S.Container>
    </SettingsWrapper>
  )
}

export default SelectScheme;
