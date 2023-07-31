import { useContext } from 'react';
import PayProvider from '../../../../../shared/svgcomponents/PayProvider';
import * as S from '../../../PaymentTerminal.styles';
import { AppContext, SettingModes, SupportedSchemesType } from '../../../utils/settingsReducer';
import { Button, IconContainer, List, SettingHeader, SettingsWrapper, Wrap } from "../../style";
import { ReactComponent as CloseIcon } from '../../../../../../assets/svgs/close.svg';
import '../../customradiobuttons.css';
import Checkmark from './checkmark';


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
              <Checkmark isDisplayed={ state.selectedScheme === scheme }/> 
            </Button>
          ))}
        </List>
      </S.Container>
    </SettingsWrapper>
  )
}

export default SelectScheme;
