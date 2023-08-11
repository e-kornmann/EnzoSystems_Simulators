import axios from "axios";

const baseURL = import.meta.env.VITE_SCAN_API_BASE_URL || `http://localhost:${import.meta.env.VITE_SCAN_PORT}/${import.meta.env.VITE_SCAN_API_BASE_PATH}/v${import.meta.env.VITE_SCAN_API_VERSION}`;

export default axios.create({
  baseURL: baseURL
});

