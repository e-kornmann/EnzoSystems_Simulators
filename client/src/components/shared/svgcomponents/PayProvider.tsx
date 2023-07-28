import { ReactComponent as ApplePay } from '../../../assets/svgs/PayProviders/applepay.svg';
import { ReactComponent as Amex } from '../../../assets/svgs/PayProviders/amex.svg';
import { ReactComponent as GooglePay } from '../../../assets/svgs/PayProviders/googlepay-oldlogo.svg';
import { ReactComponent as PayPal } from '../../../assets/svgs/PayProviders/paypal.svg';
import { ReactComponent as Visa } from '../../../assets/svgs/PayProviders/visa.svg';
import { ReactComponent as AliPay } from '../../../assets/svgs/PayProviders/alipay.svg';
import { ReactComponent as Mastercard } from '../../../assets/svgs/PayProviders/mastercard.svg';
import { ReactComponent as Bancontact } from '../../../assets/svgs/PayProviders/bancontact.svg';
import { ReactComponent as Diners } from '../../../assets/svgs/PayProviders/dinersclub.svg';
import { ReactComponent as JcbBank } from '../../../assets/svgs/PayProviders/jcbbank.svg';
import { ReactComponent as Wechat } from '../../../assets/svgs/PayProviders/wechatpay.svg';
import { ReactComponent as Maestro } from '../../../assets/svgs/PayProviders/maestro.svg';
import { ReactComponent as Ideal } from '../../../assets/svgs/PayProviders/ideal.svg';
import { ReactComponent as Unionpay } from '../../../assets/svgs/PayProviders/unionpay.svg';
import { ReactComponent as Giropay } from '../../../assets/svgs/PayProviders/giropay.svg';
import { ReactComponent as Discover } from '../../../assets/svgs/PayProviders/discover.svg';
import { SupportedSchemesType } from '../../simulators/PaymentDevice/types/PaymentTypes';




type Props = {
  width: number;
  height: number;
  provider: SupportedSchemesType;
};

const PayProvider = ({ width, height, provider }: Props) => {
  
  switch (provider) {
    case SupportedSchemesType.APPLEPAY:
      return <ApplePay width={width} height={height}/>;
    case SupportedSchemesType.AMEX:
      return <Amex width={width} height={height}/>;
    case SupportedSchemesType.GOOGLEPAY:
      return <GooglePay width={width} height={height}/>;
    case SupportedSchemesType.PAYPAL:
      return <PayPal width={width} height={height}/>;
    case SupportedSchemesType.VISA:
      return <Visa width={width} height={height}/>;
    case SupportedSchemesType.ALIPAY:
      return <AliPay width={width} height={height}/>;
    case SupportedSchemesType.MASTERCARD:
      return <Mastercard width={width} height={height}/>;
    case SupportedSchemesType.MAESTRO:
      return <Maestro width={width} height={height}/>;
    case SupportedSchemesType.DINERS:
      return <Diners width={width} height={height}/>;
    case SupportedSchemesType.BANCONTACT:
      return <Bancontact width={width} height={height}/>;
    case SupportedSchemesType.JCB_BANK:
      return <JcbBank width={width} height={height}/>;
    case SupportedSchemesType.WECHATPAY:
      return <Wechat width={width} height={height}/>;
    case SupportedSchemesType.IDEAL:
      return <Ideal width={width} height={height}/>;
    case SupportedSchemesType.UNIONPAY:
      return <Unionpay width={width} height={height}/>;
    case SupportedSchemesType.GIROPAY:
      return <Giropay width={width} height={height}/>;
    case SupportedSchemesType.DISCOVER:
      return <Discover width={width} height={height}/>;
    default:
      return <div style={{width, height, color: 'gray'}}> ○ </div> 
  }
};

export default PayProvider;

