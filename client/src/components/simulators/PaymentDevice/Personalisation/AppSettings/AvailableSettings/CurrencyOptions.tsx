import { useContext } from 'react';
import { CurrencyCode } from '../../../../../../types/CurrencyTypes';
import { AppContext, SettingModes } from '../../../utils/settingsReducer';
import { Button, List } from "../../style";
import Checkmark from './checkmark';


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
    <List>
      {currencies.map((currency) => (
        <Button key={currency} onClick={() => onChangeEventHandler(currency)}>
          {currency}
          <Checkmark isDisplayed={state.currency === currency }/> 
        </Button>
      ))}
    </List>
  )
}
export default CurrencyOptions;
