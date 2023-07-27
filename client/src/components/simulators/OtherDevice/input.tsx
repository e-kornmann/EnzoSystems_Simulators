
import CurrencyInput from './CurrencyInput';
import { CurrencyInputProps } from './CurrencyInputProps';


const options: ReadonlyArray<CurrencyInputProps['intlConfig']> = [
  {
    locale: 'de-DE',
    currency: 'EUR',
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

type Props = {
  value: string | undefined;
  handleOnValueChange: (value: string | undefined) => void;
  intlConfig: CurrencyInputProps['intlConfig'];
  handleIntlSelect: (event: React.ChangeEvent<HTMLSelectElement>)  => void;
}

export const Example3 = ({ value, handleOnValueChange, intlConfig, handleIntlSelect }: Props) => {




  return (
        <>
                <CurrencyInput
                  id="validationCustom04"
                  name="input-1"
                  intlConfig={intlConfig}
                  className={`form-control`}
                  onValueChange={handleOnValueChange}
                  decimalsLimit={6}
                  value={value}
                  step={1}
                />
          
              <div>
                <label htmlFor="intlConfigSelect">Intl option</label>
                <select id="intlConfigSelect" onChange={handleIntlSelect}>
                  {options.map((config, i) => {
                    if (config) {
                      const { locale, currency } = config;
                      return (
                        <option key={`${locale}${currency}`} value={i}>
                          {locale}
                        </option>
                      );
                    }
                  })}
                </select>
              </div>
          </>

  );
};

export default Example3;