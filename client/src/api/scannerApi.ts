import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_API_URL || `http://localhost:${import.meta.env.VITE_PORT}/${import.meta.env.VITE_API_BASE_PATH}/v${import.meta.env.VITE_API_VERSION}`;

export default axios.create({
  baseURL: baseURL
});

