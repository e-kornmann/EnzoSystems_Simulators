import { CurrencyCode } from "../../../../../types/CurrencyTypes";
import { Locale } from "../../../../../types/LocaleTypes";
import { CurrencyInputProps } from "../../CurrencyInputProps";

export const options: ReadonlyArray<CurrencyInputProps['intlConfig']> = [
    {
      locale: Locale.nl_NL,
      currency: CurrencyCode.EUR,
    },
    {
      locale: 'en-US',
      currency: 'USD',
    },
    {
      locale: 'en-GB',
      currency: 'GBP',
    },
    {
      locale: 'ja-JP',
      currency: 'JPY',
    },
    {
      locale: 'en-IN',
      currency: 'INR',
    },
  ];