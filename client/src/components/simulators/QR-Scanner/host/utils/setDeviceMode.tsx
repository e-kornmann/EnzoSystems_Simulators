import scanApi from "../../../../../api/scannerApi";


export const setDeviceMode = async (accessToken: string, deviceMode: string) => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      };
        const response = await scanApi.put(`/mode`,
        {
            mode: deviceMode
        },
        config
      );
      return response.status
    } catch (error) {
      console.error('Unable to set mode:', error);
      return undefined;
    }
  };





