
import { ReactComponent as ApplePay } from '../../../../assets/svgs/PayProviders/applepay.svg';

type Props = {
  width: number;
  height: number;
  provider: string;
};

const CurrentPayProvider = ({ width, height, provider }: Props) => {
  let currentProvider = null;

  switch (provider) {
    case 'applepay':
      currentProvider = <ApplePay />;
      break;
    default:
      currentProvider = null;
      break;
  }

  return (
    <div style={{ border: '1px solid #141414', borderRadius: '5px', width, height}}>
      {currentProvider}
    </div>
  );
};

export default CurrentPayProvider;
