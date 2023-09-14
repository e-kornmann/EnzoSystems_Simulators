import { ReactComponent as AliPay } from '../local_assets/PayProviders/alipay.svg';
import { ReactComponent as Amex } from '../local_assets/PayProviders/amex.svg';
import { ReactComponent as ApplePay } from '../local_assets/PayProviders/applepay.svg';
import { ReactComponent as Bancontact } from '../local_assets/PayProviders/bancontact.svg';

import { ReactComponent as CartesBancaires } from '../local_assets/PayProviders/cartesbancaires.svg';
import { ReactComponent as Diners } from '../local_assets/PayProviders/dinersclub.svg';
import { ReactComponent as Discover } from '../local_assets/PayProviders/discover.svg';
import { ReactComponent as GiroCard } from '../local_assets/PayProviders/girocard.svg';

import { ReactComponent as Giropay } from '../local_assets/PayProviders/giropay.svg';
import { ReactComponent as GooglePay } from '../local_assets/PayProviders/googlepay-oldlogo.svg';
import { ReactComponent as IDeal } from '../local_assets/PayProviders/ideal.svg';
import { ReactComponent as Interac } from '../local_assets/PayProviders/interac.svg';

import { ReactComponent as JcbBank } from '../local_assets/PayProviders/jcb.svg';
import { ReactComponent as Maestro } from '../local_assets/PayProviders/meastro.svg';
import { ReactComponent as Mastercard } from '../local_assets/PayProviders/mastercard.svg';
import { ReactComponent as MastercardDebit } from '../local_assets/PayProviders/mastercard-debit.svg';

import { ReactComponent as MasterPass } from '../local_assets/PayProviders/masterpass.svg';
import { ReactComponent as PayPal } from '../local_assets/PayProviders/paypal.svg';
import { ReactComponent as SwissPost } from '../local_assets/PayProviders/swisspost.svg';
import { ReactComponent as SwissReka } from '../local_assets/PayProviders/swissreka.svg';

import { ReactComponent as Twint } from '../local_assets/PayProviders/twint.svg';
import { ReactComponent as Unionpay } from '../local_assets/PayProviders/unionpay.svg';
import { ReactComponent as Visa } from '../local_assets/PayProviders/visa.svg';
import { ReactComponent as VisaElectron } from '../local_assets/PayProviders/visa-electron.svg';

import { ReactComponent as VisaDebit } from '../local_assets/PayProviders/visa-debit.svg';
import { ReactComponent as VPay } from '../local_assets/PayProviders/vpay.svg';
import { ReactComponent as Wechat } from '../local_assets/PayProviders/wechatpay.svg';

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
