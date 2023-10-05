import { memo, useContext } from 'react';
import { AppContext, SettingModes } from '../../../utils/settingsReducer';
import * as S from '../../../../local_shared/DraggableModal/ModalTemplate';
import { ReactComponent as CheckMarkIcon } from '../../../../local_assets/checkmark.svg';
import CurrencyCode from '../../../enums/Currency';

const CurrencyOptionsComponent = () => {
  const { state, dispatch } = useContext(AppContext);

  const currencies = [
    CurrencyCode.EUR,
    CurrencyCode.USD,
    CurrencyCode.GBP,
    CurrencyCode.CHF,
  ];

  const onChangeEventHandler = (currency: CurrencyCode) => {
    dispatch({ type: SettingModes.CURRENCY, payload: currency });
    // hier de local storage updaten,
  };

  return (
    <S.SharedStyledList>
      {currencies.map(currency => (
        <S.SharedStyledListButton key={currency} onClick={() => onChangeEventHandler(currency)}>
          {currency}
          {state.currency === currency && <CheckMarkIcon width={14} height={11} />}
        </S.SharedStyledListButton>
      ))}
    </S.SharedStyledList>
  );
};
export const CurrencyOptions = memo(CurrencyOptionsComponent);
