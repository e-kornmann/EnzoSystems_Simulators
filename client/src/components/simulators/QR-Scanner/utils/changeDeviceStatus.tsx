import scanApi from "../../../../api/scannerApi";

export const changeDeviceStatus = async (accessToken: string, changeToThisState: string) => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      };
        const response = await scanApi.put(`/status`,
        {
          status: changeToThisState
        },
        config
      );
      return response;
    } catch (error) {
       console.error('Unable to connect:', error);
      return undefined;
    }
  };





