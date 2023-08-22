import scanApi from "../../../../../api/scannerApi";

export const getStatus = async (accessToken: string, currentStatus: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await scanApi.get(`/status?currentStatus=${currentStatus}&longPollingSecs=15`, config);
    return response.data.status;
  } catch (error) {
    console.error('Error fetching status:', error);
    return null;
  }
};


    // if (axios.isAxiosError(error)) {
    //   if (error.response) {
    //     console.error('Response data:', error.response.data);
    //     console.error('Response status:', error.response.status);
    //     return null;
    //   } else {
    //     console.error('Network error:', error);
    //     return null;
    //   }
    // } else {
    //   console.error('Unexpected error:', error);
