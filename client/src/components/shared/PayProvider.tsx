import { ReactComponent as ApplePay } from '../../assets/svgs/PayProviders/applepay.svg';
import { ReactComponent as Amex } from '../../assets/svgs/PayProviders/amex.svg';
import { ReactComponent as GooglePay } from '../../assets/svgs/PayProviders/googlepay-oldlogo.svg';
import { ReactComponent as PayPal } from '../../assets/svgs/PayProviders/paypal.svg';
import { ReactComponent as Visa } from '../../assets/svgs/PayProviders/visa.svg';
import { ReactComponent as AliPay } from '../../assets/svgs/PayProviders/alipay.svg';
import { ReactComponent as Mastercard } from '../../assets/svgs/PayProviders/mastercard.svg';
import { ReactComponent as Bancontact } from '../../assets/svgs/PayProviders/bancontact.svg';
import { ReactComponent as Diners } from '../../assets/svgs/PayProviders/dinersclub.svg';
import { ReactComponent as JcbBank } from '../../assets/svgs/PayProviders/jcb.svg';
import { ReactComponent as Wechat } from '../../assets/svgs/PayProviders/wechatpay.svg';
import { ReactComponent as Maestro } from '../../assets/svgs/PayProviders/meastro.svg';
import { ReactComponent as Ideal } from '../../assets/svgs/PayProviders/ideal.svg';
import { ReactComponent as Unionpay } from '../../assets/svgs/PayProviders/unionpay.svg';
import { ReactComponent as Giropay } from '../../assets/svgs/PayProviders/giropay.svg';
import { ReactComponent as Discover } from '../../assets/svgs/PayProviders/discover.svg';
import { SupportedSchemesType } from '../simulators/PaymentDevice/types/PaymentTypes';

type Props = {
  width: number;
  height: number;
  provider: SupportedSchemesType;
  border: boolean;
};

const PayProvider = ({ width, height, provider, border }: Props) => {
  
  const PayProviderStyle: React.CSSProperties = {
    width, height, border: border ? '1px solid lightgray' : 'none', color: 'gray', borderRadius: '4px'
  };

  switch (provider) {
    case SupportedSchemesType.APPLEPAY:
      return <ApplePay style={PayProviderStyle} />;
    case SupportedSchemesType.AMEX:
      return <Amex style={PayProviderStyle} />;
    case SupportedSchemesType.GOOGLEPAY:
      return <GooglePay style={PayProviderStyle} />;
    case SupportedSchemesType.PAYPAL:
      return <PayPal style={PayProviderStyle} />;
    case SupportedSchemesType.VISA:
      return <Visa style={PayProviderStyle} />;
    case SupportedSchemesType.ALIPAY:
      return <AliPay style={PayProviderStyle} />;
    case SupportedSchemesType.MASTERCARD:
      return <Mastercard style={PayProviderStyle} />;
    case SupportedSchemesType.MAESTRO:
      return <Maestro style={PayProviderStyle} />;
    case SupportedSchemesType.DINERS:
      return <Diners style={PayProviderStyle} />;
    case SupportedSchemesType.BANCONTACT:
      return <Bancontact style={PayProviderStyle} />;
    case SupportedSchemesType.JCB_BANK:
      return <JcbBank style={PayProviderStyle} />;
    case SupportedSchemesType.WECHATPAY:
      return <Wechat style={PayProviderStyle} />;
    case SupportedSchemesType.IDEAL:
      return <Ideal style={PayProviderStyle} />;
    case SupportedSchemesType.UNIONPAY:
      return <Unionpay style={PayProviderStyle} />;
    case SupportedSchemesType.GIROPAY:
      return <Giropay style={PayProviderStyle} />;
    case SupportedSchemesType.DISCOVER:
      return <Discover style={PayProviderStyle} />;
    default:
      return <div style={PayProviderStyle}> ○ </div> 
  }
};

export default PayProvider;
