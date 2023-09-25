import { useContext } from 'react';
import CurrencyCode from '../../../../../types/CurrencyTypes';
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import * as S from '../../../../shared/DraggableModal/ModalTemplate';
import { SharedCheckMark } from '../../../../shared/CheckAndCrossIcon';

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
          <SharedCheckMark isDisplayed={state.currency === currency } width={14} height={11} />
        </S.SharedStyledListButton>
      ))}
    </S.SharedStyledList>
  );
};
export default CurrencyOptions;
