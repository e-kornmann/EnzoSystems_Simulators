
import { ReactComponent as Arrow } from '../../../../../../assets/svgs/arrow.svg';
import { StateDispatchProps } from '../../../utils/settingsReducer';

import { Button, List } from "../../style";

const PinOptions = ({ state }: StateDispatchProps) => {


return (

<List>
  <Button>YES {state.currency}<Arrow/></Button>
  <Button>NO {state.operationalModeOption}<Arrow/></Button>
</List>

)

}
export default PinOptions;




