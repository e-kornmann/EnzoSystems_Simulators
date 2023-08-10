export const isApiEnabledRequest = async (hostIsEnabled: boolean) => hostIsEnabled === false ? 409 : 200;
    
