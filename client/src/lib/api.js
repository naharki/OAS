import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // Important to send cookies
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },

});
 console.log("API Base URL:", process.env.NEXT_PUBLIC_API_URL);
 
// Optional: interceptors
api.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error.response?.status);
    return Promise.reject(error);
  }
);

export default api;
