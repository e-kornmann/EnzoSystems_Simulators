import axios from "axios";

// hoezo werkt dit niet?
// const baseURL = process.env.REACT_APP_BASE_URL || "http://localhost:8080";
const baseURL = "http://localhost:8080";

export default axios.create({
  baseURL: baseURL
});

