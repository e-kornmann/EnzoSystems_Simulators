import { useContext } from "react";
import { QrAppModi } from ".";
import { AppContext } from "./utils/settingsReducer";
import ts from "./Translations/translations";

type Props = {
    currentModus: QrAppModi;
  }
  
  const HeaderText = ({currentModus}: Props) => {
    const { state } = useContext(AppContext);
    return (
      <>
      {state?.language &&
        ts(currentModus, state.language)}
      </>
    )
  }


  export default HeaderText;