import axios from "axios";
const COMPANY_ID = process.env.REACT_APP_COMPANY_ID;

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authInfo =
      localStorage.getItem("user") &&
      localStorage.getItem("user");

    const token = authInfo ? JSON.parse(authInfo)?.access_token : "";


    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    config.headers.COMPANY_ID = COMPANY_ID;
    return config;
  },
  (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status >= 200 && response.status <= 299) {
      return response;
    }
    return Promise.reject(response.data);
  },
  (error) => {
    const expErr =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expErr) {
      console.log("Unexpected error : ", error.response);
    }

    if (error.response) {
      return error.response.data;
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
