import { memo, useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { AppContext, SettingModes } from '../../../utils/settingsReducer';
import { ReactComponent as CheckMarkIcon } from '../../../../local_assets/checkmark.svg';
import * as S from '../../../../local_shared/DraggableModal/ModalTemplate';
import { PayProvider } from '../../../components/PayProviders/PayProvider';
import { SupportedSchemesType } from '../../../enums/SupportedSchemes';

const StyledFooter = styled(S.SharedStyledFooter)({
  position: 'absolute',
  height: '40px',
  bottom: '0px',
});

const StyledList = styled('div')(({ theme }) => ({
  backgroundColor: theme.colors.background.secondary,
  position: 'fixed',
  top: '34px',
  left: '0',
  height: 'calc(100% - 75px)',
  width: '100%',
  padding: '2px 0',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'scroll',
  zIndex: '600',
}));

export const Wrap = styled('div')({
  display: 'flex',
  alignItems: 'center',
  columnGap: '8px',
});

type Props = {
  onHide: () => void;
};

const SchemeOptionsComponent = ({ onHide }: Props) => {
  const { state, dispatch } = useContext(AppContext);
  const [updateOfSelectedSchemes, setUpdateOfSelectedSchemes] = useState(state.selectedSchemes);
  const [allSelected, setAllSelected] = useState(false);
  const [saveButtonIsActive, setSaveButtonIsActive] = useState(false);

  const isSchemeSelected = (scheme: SupportedSchemesType) => updateOfSelectedSchemes.includes(scheme);

  const toggleScheme = (scheme: SupportedSchemesType) => {
    const updatedScheme = isSchemeSelected(scheme)
      ? updateOfSelectedSchemes.filter(s => s !== scheme)
      : [...updateOfSelectedSchemes, scheme];
    setUpdateOfSelectedSchemes(updatedScheme);
    setSaveButtonIsActive(true);
  };

  const saveHandler = () => {
    // if one scheme is selected, please use it immediately
    if (updateOfSelectedSchemes.length === 1) {
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
    const areAllSchemesSelected = allSchemes.every(scheme => updateOfSelectedSchemes.includes(scheme));
    if (areAllSchemesSelected) setAllSelected(true);
    else setAllSelected(false);
  }, [updateOfSelectedSchemes]);

  useEffect(() => {
    // Check if at least one button is selected before activating the save button
    if (updateOfSelectedSchemes.length === 0) setSaveButtonIsActive(false);
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
      <StyledList>
        <S.SharedStyledListButton onClick={randomHandler}> Random </S.SharedStyledListButton>
        {Object.values(SupportedSchemesType).map(scheme => (
          <S.SharedStyledListButton key={scheme} onClick={() => toggleScheme(scheme)}>
            <Wrap>
            <S.SharedStyledCheckBox $isSelected={isSchemeSelected(scheme)}>
            <CheckMarkIcon width={9} height={6} />
            </S.SharedStyledCheckBox>
              <PayProvider width={30} height={22} provider={scheme} border={false} />
              {scheme}
            </Wrap>

          </S.SharedStyledListButton>
        ))}
      </StyledList>
      <StyledFooter>
        <button type="button" onClick={selectOrDeselectAllHandler}>
          { allSelected ? 'Deselect all' : 'Select all' }
        </button>
        <button type="button" onClick={saveHandler} disabled={!saveButtonIsActive}>
          Save
        </button>
      </StyledFooter>
    </>
  );
};

export const SchemeOptions = memo(SchemeOptionsComponent);
