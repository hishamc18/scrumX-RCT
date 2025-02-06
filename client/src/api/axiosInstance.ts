import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:3300/api", // Update with your actual backend URL
    withCredentials: true, // Include cookies if needed
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;
