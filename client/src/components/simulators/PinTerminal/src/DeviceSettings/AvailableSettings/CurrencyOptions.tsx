import { useContext } from 'react';
import CurrencyCode from '../../../../../types/CurrencyTypes';
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import * as S from '../../../../shared/DraggableModal/ModalTemplate';
import { ReactComponent as CheckMarkIcon } from '../../../../../assets/svgs/check-mark.svg';

const CurrencyOptions = () => {
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
export default CurrencyOptions;
