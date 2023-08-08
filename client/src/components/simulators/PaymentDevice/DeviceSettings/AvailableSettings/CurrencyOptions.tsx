import { useContext } from 'react';
import { CurrencyCode } from '../../../../../types/CurrencyTypes';
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import * as S from '../../../../shared/DraggableModal/ModalTemplate';
import Checkmark from '../checkmark/Checkmark';


const CurrencyOptions = () => {
  const { state, dispatch } = useContext(AppContext);

  const currencies = [
    CurrencyCode.EUR, 
    CurrencyCode.USD,
    CurrencyCode.GBP,
    CurrencyCode.CHF
  ];

  const onChangeEventHandler = (currency: CurrencyCode) => {
    dispatch({ type: SettingModes.CURRENCY, payload: currency });
  };

  return (
    <S.GenericList>
      {currencies.map((currency) => (
        <S.GenericListButton key={currency} onClick={() => onChangeEventHandler(currency)}>
          {currency}
          <Checkmark isDisplayed={state.currency === currency }/> 
        </S.GenericListButton>
      ))}
    </S.GenericList>
  )
}
export default CurrencyOptions;
