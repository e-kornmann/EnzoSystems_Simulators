import styled from 'styled-components';
import CurrencyInput from './CurrencyInput';
import { CurrencyInputProps } from './CurrencyInputProps';
import options from '../settings/settings';
import './custom-inputfield.css';

type Props = {
  value: string | undefined;
  handleOnValueChange: (value: string | undefined) => void;
  intlConfig: CurrencyInputProps['intlConfig'];
  handleIntlSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const InputWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
const Input = styled.div`
  width: 100%;
  `;
const Dropdown = styled.div`
  width: 80px;
  position: relative;
  top: -34px;
  left: 0px;
`;

export const InputAmount = ({
  value,
  handleOnValueChange,
  intlConfig,
  handleIntlSelect,
}: Props) => (
  <InputWrapper>
    <Input>
      <CurrencyInput
        id="validationCustom04"
        name="input-1"
        intlConfig={intlConfig}
        className={'form-container-input'}
        onValueChange={handleOnValueChange}
        decimalsLimit={2}
        value={value}
        step={1}
      />
    </Input>
    <Dropdown>
      <div className="select-dropdown">

        <select id="intlConfigSelect" onChange={handleIntlSelect}>
          {
            options.map((config, i) => {
              if (!config) {
                return null; // Skip rendering for null or undefined values
              }
              const { locale, currency } = config;
              const key = `${locale}${currency}`;

              return (
                <option key={key} value={i}>
                  {locale}
                </option>
              );
            })
          }
        </select>
      </div>
    </Dropdown>
  </InputWrapper>

);

export default InputAmount;
