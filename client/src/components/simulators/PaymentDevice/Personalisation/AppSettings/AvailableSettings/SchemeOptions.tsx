
import { useContext } from 'react';
import { AppContext, SettingModes, SupportedSchemesType } from '../../../utils/settingsReducer';
import PayProvider from '../../../../../shared/svgcomponents/PayProvider';
import { Button, List, Wrap } from "../../style";
import '../../customradiobuttons.css'
import Checkmark from './checkmark';


const SchemeOptions = () => {
  const { state, dispatch } = useContext(AppContext);
  
  const isSchemeSelected = (scheme: SupportedSchemesType) => {
    return state.availableSchemes.includes(scheme);
  };

  const toggleScheme = (scheme: SupportedSchemesType) => {
    const updatedSchemes = isSchemeSelected(scheme)
      ? state.availableSchemes.filter((s) => s !== scheme)
      : [...state.availableSchemes, scheme];

    dispatch({
      type: SettingModes.AVAILABLE_SCHEMES,
      payload: updatedSchemes,
    });
  };

  return (
    <List>
      {Object.values(SupportedSchemesType).map(scheme => (
        <Button key={scheme} onClick={() => toggleScheme(scheme)}>
          <Wrap><PayProvider width={48} height={28} provider={scheme}/>{scheme}</Wrap>
          <Checkmark isDisplayed={isSchemeSelected(scheme)}/> 
        </Button>
      ))}
    </List>
  );
};

export default SchemeOptions;
