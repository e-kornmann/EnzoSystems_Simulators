import { ReactComponent as AliPay } from '../../assets/svgs/PayProviders/alipay.svg';
import { ReactComponent as Amex } from '../../assets/svgs/PayProviders/amex.svg';
import { ReactComponent as ApplePay } from '../../assets/svgs/PayProviders/applepay.svg';
import { ReactComponent as Bancontact } from '../../assets/svgs/PayProviders/bancontact.svg';

import { ReactComponent as CartesBancaires } from '../../assets/svgs/PayProviders/cartesbancaires.svg';
import { ReactComponent as Diners } from '../../assets/svgs/PayProviders/dinersclub.svg';
import { ReactComponent as Discover } from '../../assets/svgs/PayProviders/discover.svg';
import { ReactComponent as GiroCard } from '../../assets/svgs/PayProviders/girocard.svg';

import { ReactComponent as Giropay } from '../../assets/svgs/PayProviders/giropay.svg';
import { ReactComponent as GooglePay } from '../../assets/svgs/PayProviders/googlepay-oldlogo.svg';
import { ReactComponent as IDeal } from '../../assets/svgs/PayProviders/ideal.svg';
import { ReactComponent as Interac } from '../../assets/svgs/PayProviders/interac.svg';

import { ReactComponent as JcbBank } from '../../assets/svgs/PayProviders/jcb.svg';
import { ReactComponent as Maestro } from '../../assets/svgs/PayProviders/meastro.svg';
import { ReactComponent as Mastercard } from '../../assets/svgs/PayProviders/mastercard.svg';
import { ReactComponent as MastercardDebit } from '../../assets/svgs/PayProviders/mastercard-debit.svg';

import { ReactComponent as MasterPass } from '../../assets/svgs/PayProviders/masterpass.svg';
import { ReactComponent as PayPal } from '../../assets/svgs/PayProviders/paypal.svg';
import { ReactComponent as SwissPost } from '../../assets/svgs/PayProviders/swisspost.svg';
import { ReactComponent as SwissReka } from '../../assets/svgs/PayProviders/swissreka.svg';

import { ReactComponent as Twint } from '../../assets/svgs/PayProviders/twint.svg';
import { ReactComponent as Unionpay } from '../../assets/svgs/PayProviders/unionpay.svg';
import { ReactComponent as Visa } from '../../assets/svgs/PayProviders/visa.svg';
import { ReactComponent as VisaElectron } from '../../assets/svgs/PayProviders/visa-electron.svg';

import { ReactComponent as VisaDebit } from '../../assets/svgs/PayProviders/visa-debit.svg';
import { ReactComponent as VPay } from '../../assets/svgs/PayProviders/vpay.svg';
import { ReactComponent as Wechat } from '../../assets/svgs/PayProviders/wechatpay.svg';

export enum SupportedSchemesType {
  ALIPAY = 'Alipay',
  AMEX = 'AMEX',
  APPLEPAY = 'ApplePay',
  BANCONTACT = 'Bancontact',

  CARTESBANCAIRES = 'Cartes Bancaires',
  DINERS = 'Diners Club',
  DISCOVER = 'Discover',
  GIROCARD = 'Girocard',

  GIROPAY = 'Giropay',
  GOOGLEPAY = 'Google Pay',
  IDEAL = 'iDEAL',
  INTERAC = 'Interac',

  JCB_BANK = 'JCB',
  MAESTRO = 'Maestro',
  MASTERCARD = 'Mastercard',
  MASTERCARDDEBIT = 'Mastercard Debit',

  MASTERPASS = 'Masterpass',
  PAYPAL = 'PayPal',
  SWISSPOST = 'Swiss Post',
  SWISSREKA = 'Swiss Reka',

  TWINT = 'Twint',
  UNIONPAY = 'UnionPay',
  VISA = 'Visa',
  VISAELECTRON = 'Visa Electron',

  VISADEBIT = 'Visa Debit',
  VPAY = 'V PAY',
  WECHATPAY = 'WeChat Pay',
}

type Props = {
  width: number;
  height: number;
  provider: SupportedSchemesType;
  border: boolean;
};

const PayProvider = ({
  width, height, provider, border,
}: Props) => {
  const PayProviderStyle: React.CSSProperties = {
    width, height, border: border ? '1px solid lightgray' : 'none', color: 'gray', borderRadius: '4px',
  };

  switch (provider) {
    case SupportedSchemesType.ALIPAY:
      return <AliPay style={PayProviderStyle} />;
    case SupportedSchemesType.AMEX:
      return <Amex style={PayProviderStyle} />;
    case SupportedSchemesType.APPLEPAY:
      return <ApplePay style={PayProviderStyle} />;
    case SupportedSchemesType.BANCONTACT:
      return <Bancontact style={PayProviderStyle} />;

    case SupportedSchemesType.CARTESBANCAIRES:
      return <CartesBancaires style={PayProviderStyle} />;
    case SupportedSchemesType.DINERS:
      return <Diners style={PayProviderStyle} />;
    case SupportedSchemesType.DISCOVER:
      return <Discover style={PayProviderStyle} />;
    case SupportedSchemesType.GIROCARD:
      return <GiroCard style={PayProviderStyle} />;

    case SupportedSchemesType.GIROPAY:
      return <Giropay style={PayProviderStyle} />;
    case SupportedSchemesType.GOOGLEPAY:
      return <GooglePay style={PayProviderStyle} />;
    case SupportedSchemesType.IDEAL:
      return <IDeal style={PayProviderStyle} />;
    case SupportedSchemesType.INTERAC:
      return <Interac style={PayProviderStyle} />;

    case SupportedSchemesType.JCB_BANK:
      return <JcbBank style={PayProviderStyle} />;
    case SupportedSchemesType.MAESTRO:
      return <Maestro style={PayProviderStyle} />;
    case SupportedSchemesType.MASTERCARD:
      return <Mastercard style={PayProviderStyle} />;
    case SupportedSchemesType.MASTERCARDDEBIT:
      return <MastercardDebit style={PayProviderStyle} />;

    case SupportedSchemesType.MASTERPASS:
      return <MasterPass style={PayProviderStyle} />;
    case SupportedSchemesType.PAYPAL:
      return <PayPal style={PayProviderStyle} />;
    case SupportedSchemesType.SWISSPOST:
      return <SwissPost style={PayProviderStyle} />;
    case SupportedSchemesType.SWISSREKA:
      return <SwissReka style={PayProviderStyle} />;

    case SupportedSchemesType.TWINT:
      return <Twint style={PayProviderStyle} />;
    case SupportedSchemesType.UNIONPAY:
      return <Unionpay style={PayProviderStyle} />;
    case SupportedSchemesType.VISA:
      return <Visa style={PayProviderStyle} />;
    case SupportedSchemesType.VISAELECTRON:
      return <VisaElectron style={PayProviderStyle} />;

    case SupportedSchemesType.VISADEBIT:
      return <VisaDebit style={PayProviderStyle} />;
    case SupportedSchemesType.VPAY:
      return <VPay style={PayProviderStyle} />;
    case SupportedSchemesType.WECHATPAY:
      return <Wechat style={PayProviderStyle} />;

    default:
      return <div style={PayProviderStyle}> ○ </div>;
  }
};

export default PayProvider;
