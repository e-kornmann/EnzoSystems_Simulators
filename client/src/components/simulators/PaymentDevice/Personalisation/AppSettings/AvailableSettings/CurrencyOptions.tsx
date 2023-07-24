
import { CurrencyCode } from '../../../../../../types/CurrencyTypes';
import { SettingModes, StateDispatchProps } from '../../../utils/settingsReducer';
import { Button, List } from "../../style";

const CurrencyOptions = ({ state, dispatch }: StateDispatchProps) => {

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
    <List>
      {currencies.map((currency) => (
        <Button key={currency} onClick={() => onChangeEventHandler(currency)}>
          {currency}
          <input
            type="radio"
            id={currency}
            name="currencies"
            checked={state.currency === currency}
            onChange={() => onChangeEventHandler(currency)}
          />
        </Button>
      ))}
    </List>
  )
}
export default CurrencyOptions;
