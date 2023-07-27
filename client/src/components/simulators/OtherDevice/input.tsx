import React, { FC, useState } from 'react';
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

export const Example3: FC = () => {
  const [intlConfig, setIntlConfig] = useState<CurrencyInputProps['intlConfig']>(options[0]);
  const [value, setValue] = useState<string | undefined>('123');
  const [rawValue, setRawValue] = useState<string | undefined>(' ');

  const handleOnValueChange = (value: string | undefined): void => {
    setRawValue(value === undefined ? 'undefined' : value || ' ');
    setValue(value);
  };

  const handleIntlSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const config = options[Number(event.target.value)];
    if (config) {
      setIntlConfig(config);
    }
  };

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
          
              <div className="col-12 mt-3">
                <label htmlFor="intlConfigSelect">Intl option</label>
                <select className="form-control" id="intlConfigSelect" onChange={handleIntlSelect}>
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
      
          <div className="form-group col">
            <pre className="h-100 p-3 bg-dark text-white">
              <div className="row">
                <div className="col-12">
                  <div className="text-muted mr-3">onValueChange:</div>
                  {rawValue}
                  <div className="text-muted mr-3 mt-3">intlConfig:</div>
                  {JSON.stringify(intlConfig)}
                </div>
              </div>
            </pre>
          </div>
          </>

  );
};

export default Example3;