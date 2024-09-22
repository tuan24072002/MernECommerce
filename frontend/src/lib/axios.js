import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? `${import.meta.env.VITE_BACKEND_URL}/api` : "/api",
    withCredentials: true,
})
export default axiosInstance;