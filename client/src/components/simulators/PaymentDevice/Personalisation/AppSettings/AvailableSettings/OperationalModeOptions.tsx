import { ReactComponent as Arrow } from '../../../../../../assets/svgs/arrow.svg';
import { AllAppSettings, OperationalModeOptionsStates } from '../../../../../../store/reducers/settings.slice';
import { Button, List } from "../../style";
import { useSelector } from 'react-redux';

const OperationalModeOptions = () => {
  const settings: AllAppSettings = useSelector((state: any) => state.settings);
  const { operationalModeOptions } = settings;

  return (
    <List>
      <Button>
        Normal
        <input type="radio" id='normal' value="normal" checked={operationalModeOptions === OperationalModeOptionsStates.NORMAL} />
      </Button>
      <Button>
        Always succeed
        <Arrow />
      </Button>
      <Button>
        Always fail
        <Arrow />
      </Button>
      <Button>
        First fail
        <Arrow />
      </Button>
      <Button>
        First fail, then succeed
        <Arrow />
      </Button>
    </List>
  );
};

export default OperationalModeOptions;
