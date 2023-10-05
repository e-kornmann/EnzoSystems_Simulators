import { memo } from 'react';
import { ReactComponent as AliPay } from '../../assets/PayProviders/alipay.svg';
import { ReactComponent as Amex } from '../../assets/PayProviders/amex.svg';
import { ReactComponent as ApplePay } from '../../assets/PayProviders/applepay.svg';
import { ReactComponent as Bancontact } from '../../assets/PayProviders/bancontact.svg';

import { ReactComponent as CartesBancaires } from '../../assets/PayProviders/cartesbancaires.svg';
import { ReactComponent as Diners } from '../../assets/PayProviders/dinersclub.svg';
import { ReactComponent as Discover } from '../../assets/PayProviders/discover.svg';
import { ReactComponent as GiroCard } from '../../assets/PayProviders/girocard.svg';

import { ReactComponent as Giropay } from '../../assets/PayProviders/giropay.svg';
import { ReactComponent as GooglePay } from '../../assets/PayProviders/googlepay-oldlogo.svg';
import { ReactComponent as IDeal } from '../../assets/PayProviders/ideal.svg';
import { ReactComponent as Interac } from '../../assets/PayProviders/interac.svg';

import { ReactComponent as JcbBank } from '../../assets/PayProviders/jcb.svg';
import { ReactComponent as Maestro } from '../../assets/PayProviders/meastro.svg';
import { ReactComponent as Mastercard } from '../../assets/PayProviders/mastercard.svg';
import { ReactComponent as MastercardDebit } from '../../assets/PayProviders/mastercard-debit.svg';

import { ReactComponent as MasterPass } from '../../assets/PayProviders/masterpass.svg';
import { ReactComponent as PayPal } from '../../assets/PayProviders/paypal.svg';
import { ReactComponent as SwissPost } from '../../assets/PayProviders/swisspost.svg';
import { ReactComponent as SwissReka } from '../../assets/PayProviders/swissreka.svg';

import { ReactComponent as Twint } from '../../assets/PayProviders/twint.svg';
import { ReactComponent as Unionpay } from '../../assets/PayProviders/unionpay.svg';
import { ReactComponent as Visa } from '../../assets/PayProviders/visa.svg';
import { ReactComponent as VisaElectron } from '../../assets/PayProviders/visa-electron.svg';

import { ReactComponent as VisaDebit } from '../../assets/PayProviders/visa-debit.svg';
import { ReactComponent as VPay } from '../../assets/PayProviders/vpay.svg';
import { ReactComponent as Wechat } from '../../assets/PayProviders/wechatpay.svg';
import { SupportedSchemesType } from '../../enums/SupportedSchemes';

type Props = {
  width: number;
  height: number;
  provider: SupportedSchemesType;
  border: boolean;
};

const PayProviderComponent = ({
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

export const PayProvider = memo(PayProviderComponent);
