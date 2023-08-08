import { useContext, useState, useEffect } from 'react';
import { AppContext, SettingModes } from '../../utils/settingsReducer';
import PayProvider from '../../../../shared/PayProvider';
import * as S from '../../../../shared/DraggableModal/ModalTemplate';
import Checkmark from '../checkmark/Checkmark';
import { SupportedSchemesType } from '../../types/PaymentTypes';
import styled from 'styled-components';
import { GenericFooter } from '../../../../shared/DraggableModal/ModalTemplate';

const Footer = styled(GenericFooter)`
  position: absolute;
  height: 40px;
  bottom: 0px;
`;


export const Wrap = styled.div`
  display: flex;
  align-items: center;
  column-gap: 8px;
`;

type Props = {
  onHide: () => void;
};

const SchemeOptions = ({ onHide }: Props) => {
  const { state, dispatch } = useContext(AppContext);
  const [updateOfSelectedSchemes, setUpdateOfSelectedSchemes] = useState(state.selectedSchemes);
  const [allSelected, setAllSelected] = useState(false);
  const [saveButtonIsActive, setSaveButtonIsActive] = useState(false);

  const isSchemeSelected = (scheme: SupportedSchemesType) => {
    return updateOfSelectedSchemes.includes(scheme);
  };

  const toggleScheme = (scheme: SupportedSchemesType) => {
    const updatedScheme = isSchemeSelected(scheme)
      ? updateOfSelectedSchemes.filter((s) => s !== scheme)
      : [...updateOfSelectedSchemes, scheme];
    setUpdateOfSelectedSchemes(updatedScheme);
    setSaveButtonIsActive(true);
  };

  const saveHandler = () => {
    // if one scheme is selected, please use it immediately
    if (updateOfSelectedSchemes.length === 1 ) {
      dispatch({ type: SettingModes.SELECT_SCHEME, payload: updateOfSelectedSchemes[0] });  
    }
    // but in any cases.. do the following
      dispatch({ type: SettingModes.AVAILABLE_SCHEMES, payload: updateOfSelectedSchemes });
      onHide();
  };
  

  const selectOrDeselectAllHandler = () => {
    if (allSelected) {
      // Deselect all
      setUpdateOfSelectedSchemes([]);
    } else {
      // Select all
      const allSchemes = Object.values(SupportedSchemesType);
      setUpdateOfSelectedSchemes(allSchemes);
    }
  };
  useEffect(() => {
    // Check if all schemes are selected
    const allSchemes = Object.values(SupportedSchemesType);
    const areAllSchemesSelected = allSchemes.every((scheme) =>
      updateOfSelectedSchemes.includes(scheme)
    );
    areAllSchemesSelected ? setAllSelected(true) : setAllSelected(false);
    }, [updateOfSelectedSchemes]);

  useEffect(() => { 
    // Check if at least one button is selected before activating the save button
    if (updateOfSelectedSchemes.length === 0 ) setSaveButtonIsActive(false);
  }, [updateOfSelectedSchemes]);

  const randomHandler = () => {
    const availableSchemes = Object.values(SupportedSchemesType);
    const randomIndex = Math.floor(Math.random() * availableSchemes.length);
    const randomScheme = availableSchemes[randomIndex];
    setUpdateOfSelectedSchemes([randomScheme]);
    setSaveButtonIsActive(true);  
  };

  return (
    <>
      <S.GenericList>
        <S.GenericListButton onClick={randomHandler}> Random </S.GenericListButton>
        {Object.values(SupportedSchemesType).map((scheme) => (
          <S.GenericListButton key={scheme} onClick={() => toggleScheme(scheme)}>
            <Wrap>
              <PayProvider width={30} height={22} provider={scheme} border={false} />
              {scheme}
            </Wrap>
            <Checkmark isDisplayed={isSchemeSelected(scheme)} />
          </S.GenericListButton>
        ))}
      </S.GenericList>
      <Footer>
        <button type="button" onClick={selectOrDeselectAllHandler}>
          { allSelected ? 'Deselect all' : 'Select all' }
        </button>
        <button type="button" onClick={saveHandler} disabled={!saveButtonIsActive}>
          Save
        </button>
      </Footer>
    </>
  );
};

export default SchemeOptions;
