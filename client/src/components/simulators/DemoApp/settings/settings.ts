import CurrencyCode from '../../../../types/CurrencyTypes';
import Locale from '../../../../types/LocaleTypes';

const options = [
  {
    locale: Locale.nl_NL,
    currency: CurrencyCode.EUR,
  },
  {
    locale: Locale.en_US,
    currency: CurrencyCode.USD,
  },
  {
    locale: Locale.en_GB,
    currency: CurrencyCode.GBP,
  },
  {
    locale: Locale.fr_CH,
    currency: CurrencyCode.CHF,
  },
];

export default options;
