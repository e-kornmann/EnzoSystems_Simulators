import axios from "axios";
import scanApi from "../../../../api/scannerApi";

export const setDeviceStatusDisconnected = async (accessToken: string) => {
    try {
      const config = {
        headers: {
          contentType: 'application/json',
          authorization: `Bearer ${accessToken}`,
        },
      };
        const response = await scanApi.put(`/status`,
        {
          status: "DISCONNECTED"
        },
        config
      );
      return response.status
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return error.response?.status;
      }
      console.error('Unable to disconnect:', error);
      return undefined;
      
    }
  };




