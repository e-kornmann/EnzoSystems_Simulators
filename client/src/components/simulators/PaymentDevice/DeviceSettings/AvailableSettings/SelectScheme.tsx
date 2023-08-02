import { useContext } from 'react';
import PayProvider from '../../../../shared/PayProvider';
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import { ReactComponent as CloseIcon } from '../../../../../assets/svgs/close.svg';
import Checkmark from '../checkmark/Checkmark';
import { Container } from '../../../../shared/DraggableModal/ModalTemplate';
import { SupportedSchemesType } from '../../types/PaymentTypes';
import { IconContainer, SettingHeader, SettingsWrapper } from '../DeviceSettings';
import { Button, List } from './SettingModes';
import { Wrap } from './SchemeOptions';
import ts from '../../Translations/translations';


type Props = {
  hide: boolean;
  onHide: () => void;
};

const SelectScheme = ({ hide, onHide }: Props) => {
  const { state, dispatch } = useContext(AppContext);
  

  const onChangeEventHandler = (mode: SupportedSchemesType) => {
    dispatch({ type: SettingModes.SELECT_SCHEME, payload: mode });
    setTimeout(()=>onHide(), 500);
  };

  return (
    <SettingsWrapper $hide={hide}>
      <Container>
        <SettingHeader>
          <IconContainer>{null}</IconContainer>
          {ts('paymentMethod', state.language)}
          <IconContainer onClick={onHide} style={{ cursor: 'pointer' }}><CloseIcon width={13} height={13} /></IconContainer>
        </SettingHeader>
        <List>
          {state.availableSchemes.map(scheme => (
            <Button key={scheme} onClick={() => onChangeEventHandler(scheme)}>
              <Wrap><PayProvider width={30} height={22} provider={scheme} border={false} />{scheme}</Wrap>
              <Checkmark isDisplayed={ state.selectedScheme === scheme }/> 
            </Button>
          ))}
        </List>
      </Container>
    </SettingsWrapper>
  )
}

export default SelectScheme;