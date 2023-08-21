import axios from "axios";
import scanApi from "../../../../api/scannerApi";


export const getDeviceMode = async (accessToken: string) => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      };
        const response = await scanApi.get(`/mode`,
 
        config
      );
      return response.data.mode
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response;
      }
      console.error('Unable to get mode:', error);
      return undefined;
      
    }
  };





