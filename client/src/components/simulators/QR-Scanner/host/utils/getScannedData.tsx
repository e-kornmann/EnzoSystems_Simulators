import scanApi from "../../../../../api/scannerApi";

export const getScannedData = async (accessToken: string) => {
  try {
    const config = {
      headers: {
        contentType: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    };
    const response = await scanApi.get(`/scan?longPollingSecs=10`, config);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
};