import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:8000';

export default axios.create({
  baseURL: baseURL
});

