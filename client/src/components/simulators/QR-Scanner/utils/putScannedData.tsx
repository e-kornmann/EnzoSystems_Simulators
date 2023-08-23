import axios from "axios";
import scanApi from "../../../../api/scannerApi";

export const putScannedData = async (accessToken: string, qrData: string) => {
    try {
        const config = {
            headers: {
                contentType: 'application/json',
                authorization: `Bearer ${accessToken}`,
            },
        };
        const response = await scanApi.put(`/active-session`,
            {
                barcodeData: qrData
            },
            config
        );
        return response.data.metadata;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.status;
        }
        console.error('Unable to scan data:', error);
        return error;

    }
};




