
import { useContext } from 'react';
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import PayProvider from '../../../../shared/svgcomponents/PayProvider';
import { Button, List } from './SettingModes';
import Checkmark from '../checkmark/Checkmark';
import { SupportedSchemesType } from '../../types/PaymentTypes';
import styled from 'styled-components';


export const Wrap = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
 `;

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
          <Wrap><PayProvider width={30} height={22} provider={scheme} border={false}/>{scheme}</Wrap>
          <Checkmark isDisplayed={isSchemeSelected(scheme)}/> 
        </Button>
      ))}
    </List>
  );
};

export default SchemeOptions;
