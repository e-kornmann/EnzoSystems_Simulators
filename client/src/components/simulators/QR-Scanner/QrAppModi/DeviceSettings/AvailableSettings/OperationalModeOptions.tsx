import { useContext } from 'react';
import { AppContext, SettingModes } from '../../../utils/settingsReducer';
import * as S from '../../../../../shared/DraggableModal/ModalTemplate';
import * as Sv from '../../../../../../styles/stylevariables';
import Checkmark from '../../checkmark';
import { ReactComponent as Arrow } from '../../../../../../assets/svgs/arrow_back.svg';
import { ArrowWrapper } from '../DeviceSettings';

export enum OperationalModeOptionsType {
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  OUT_OF_ORDER = 'Out of order',
}


type Props = {
  arrowBackButtonHandler: () => void;
};


const OperationalModeOptions = ({arrowBackButtonHandler }: Props) => {
  const { state, dispatch } = useContext(AppContext);
  
  const onChangeEventHandler = (mode: OperationalModeOptionsType) => {
    dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: mode });
  };

  return (
    <S.GenericList>
       <ArrowWrapper onClick={arrowBackButtonHandler}>
        <Arrow width={12} height={12}  />
      </ArrowWrapper>
      {Object.values(OperationalModeOptionsType).map((mode) => (
        <S.GenericListButton key={mode} onClick={() => { onChangeEventHandler(mode);}}>
          
          {mode}
           
          <Checkmark isDisplayed={state.operationalModeOption === mode }  width={14} height={11} color={Sv.enzoOrange}/> 
        </S.GenericListButton>
      ))}
    </S.GenericList>
  );
};

export default OperationalModeOptions;