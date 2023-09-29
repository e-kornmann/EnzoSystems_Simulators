import { memo, useContext } from 'react';
import { AppContext, SettingModes } from '../../../utils/settingsReducer';
import * as S from '../../../../local_shared/DraggableModal/ModalTemplate';
import { ReactComponent as Arrow } from '../../../../local_assets/arrow_back.svg';
import { ArrowWrapper } from '../DeviceSettings';
import { QrAppModi } from '../../../App';
import { SharedCheckMark } from '../../../../local_shared/CheckAndCrossIcon';

enum DEVICESTATUSOPTIONS {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  OUT_OF_ORDER = 'OUT_OF_ORDER',
}

type Props = {
  arrowBackButtonHandler: () => void;
  modusSetterHandler: (modus: QrAppModi) => void;
};

const StatusOptionsComponent = ({ arrowBackButtonHandler, modusSetterHandler }: Props) => {
  const { state, dispatch } = useContext(AppContext);

  const onChangeEventHandler = (mode: DEVICESTATUSOPTIONS) => {
    dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: mode });
    dispatch({ type: 'STATUS_OPTION_IS_CLICKED', payload: true });
    setTimeout(() => modusSetterHandler(QrAppModi.QR_SCANNER), 200);
  };

  return (
    <S.SharedStyledList>
       <ArrowWrapper onClick={arrowBackButtonHandler}>
        <Arrow width={12} height={12} />
      </ArrowWrapper>
      {Object.values(DEVICESTATUSOPTIONS).map(mode => (
        <S.SharedStyledListButton key={mode} onClick={() => { onChangeEventHandler(mode); }}>
          {mode}
          <SharedCheckMark isDisplayed={state.statusOption === mode } width={14} height={11} />
        </S.SharedStyledListButton>
      ))}
    </S.SharedStyledList>
  );
};

export const StatusOptions = memo(StatusOptionsComponent);
