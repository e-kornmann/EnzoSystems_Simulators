import { memo, useContext } from 'react';
import { AppContext, SettingModes } from '../../../utils/settingsReducer';
import * as S from '../../../../../shared/DraggableModal/ModalTemplate';
import { ReactComponent as Arrow } from '../../../../../../assets/svgs/arrow_back.svg';
import { ArrowWrapper } from '../DeviceSettings';
import { QrAppModi } from '../../..';
import { SharedCheckMark } from '../../../../../shared/CheckAndCrossIcon';

export enum DeviceStatusOptions {
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  OUT_OF_ORDER = 'Out of order',
}

type Props = {
  arrowBackButtonHandler: () => void;
  modusSetterHandler: (modus: QrAppModi) => void;
};

const DeviceStatuses = ({ arrowBackButtonHandler, modusSetterHandler }: Props) => {
  const { state, dispatch } = useContext(AppContext);

  const onChangeEventHandler = (mode: DeviceStatusOptions) => {
    dispatch({ type: SettingModes.OPERATIONAL_MODE, payload: mode });
    setTimeout(() => modusSetterHandler(QrAppModi.QR_SCANNER), 200);
  };

  return (
    <S.GenericList>
       <ArrowWrapper onClick={arrowBackButtonHandler}>
        <Arrow width={12} height={12} />
      </ArrowWrapper>
      {Object.values(DeviceStatusOptions).map(mode => (
        <S.GenericListButton key={mode} onClick={() => { onChangeEventHandler(mode); }}>
          {mode}
          <SharedCheckMark isDisplayed={state.statusOption === mode } width={14} height={11} />
        </S.GenericListButton>
      ))}
    </S.GenericList>
  );
};

export const StatusOptions = memo(DeviceStatuses);
