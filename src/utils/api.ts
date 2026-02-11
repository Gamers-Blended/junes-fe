import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

// Request interceptor to auto add JWT token in headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const getApiErrorMessage = (
  error: any,
  defaultErrorMessage: string,
): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.log("API error:", error.response.data);
      return error.response.data.message || defaultErrorMessage;
    } else if (error.request) {
      console.log("Network error:", error.request);
      return "Network error. Please check your connection.";
    } else {
      console.log("Request setup error:", error.message);
      return error.message || defaultErrorMessage;
    }
  }
  console.log("Unexpected error:", error);
  return "An unexpected error occurred. Please try again.";
};
