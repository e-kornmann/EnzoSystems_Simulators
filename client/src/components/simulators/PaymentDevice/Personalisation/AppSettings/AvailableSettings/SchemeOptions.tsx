import { SettingModes, StateDispatchProps, SupportedSchemesType } from '../../../utils/settingsReducer';
import { Button, List } from "../../style";

const SchemeOptions = ({ state, dispatch }: StateDispatchProps) => {
  const isSchemeSelected = (scheme: SupportedSchemesType) => {
    return state.supportedSchemes.includes(scheme);
  };

  const toggleScheme = (scheme: SupportedSchemesType) => {
    const updatedSchemes = isSchemeSelected(scheme)
      ? state.supportedSchemes.filter((s) => s !== scheme)
      : [...state.supportedSchemes, scheme];

    dispatch({
      type: SettingModes.SCHEMES,
      payload: updatedSchemes,
    });
  };

  return (
    <List>
      <Button key={SupportedSchemesType.THIS_SCHEME} onClick={() => toggleScheme(SupportedSchemesType.THIS_SCHEME)}>
        {SupportedSchemesType.THIS_SCHEME}
        <input
          type="checkbox"
          id={`${SupportedSchemesType.THIS_SCHEME}-checkbox`}
          name="supported-schemes"
          checked={isSchemeSelected(SupportedSchemesType.THIS_SCHEME)}
          onChange={() => toggleScheme(SupportedSchemesType.THIS_SCHEME)}
        />
      </Button>
      <Button key={SupportedSchemesType.THAT_SCHEME} onClick={() => toggleScheme(SupportedSchemesType.THAT_SCHEME)}>
        {SupportedSchemesType.THAT_SCHEME}
        <input
          type="checkbox"
          id={`${SupportedSchemesType.THAT_SCHEME}-checkbox`}
          name="supported-schemes"
          checked={isSchemeSelected(SupportedSchemesType.THAT_SCHEME)}
          onChange={() => toggleScheme(SupportedSchemesType.THAT_SCHEME)}
        />
      </Button>
    </List>
  );
};

export default SchemeOptions;
