import { createSlice, PayloadAction } from '@reduxjs/toolkit';



enum LanguageOptions {
    EUR,
    DOLLAR,
    YAP,
    PASETOS,
}


export enum OperationalModeOptionsStates {
  NORMAL,
  ALWAYS_SUCCEED,
  ALWAYS_FAIL,
  FIRS_FAIL,
  FIRST_FAIL_THEN_SUCCEED,
}

export type AllAppSettings = {
    operationalModeOptions: OperationalModeOptionsStates;
    currency: LanguageOptions;
}

const intitialSettingState = {
    operationalModeOptions: OperationalModeOptionsStates.NORMAL,
    currency: LanguageOptions.EUR,
  } as AllAppSettings

  const settingSlice = createSlice({
    name: 'settings',
    initialState: intitialSettingState,
    reducers: {
      updateSettings: (state: AllAppSettings, action: PayloadAction<AllAppSettings>): AllAppSettings => {
        return {
          ...state,
            operationalModeOptions: action.payload.operationalModeOptions,
            currency: action.payload.currency,
        };
      
      },
      defaultSettings: () => {
        return intitialSettingState;
      },
    }, 
  });

  export const { updateSettings, defaultSettings } = settingSlice.actions;
  export default settingSlice.reducer;