import { ReactComponent as Arrow } from '../../../../../../assets/svgs/arrow.svg';
import { Button, List } from "../../style";


const OperationalModeOptions = () => {



  return (
    <List>
      <Button>
        Normal
        <Arrow />
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
