import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3300/api",
    withCredentials: true,
});

export default axiosInstance;
