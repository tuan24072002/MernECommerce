import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });
        toast.dismiss();
        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Passwords do not match")
        }
        try {
            const res = await axios.post("/auth/signup", { name, email, password })
            set({ user: res.data.user })
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred during signup")
        } finally {
            set({ loading: false })
        }
    },
    login: async ({ email, password }) => {
        set({ loading: true });
        toast.dismiss();
        try {
            const res = await axios.post("/auth/login", { email, password })
            set({ user: res.data.user })
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred during login")
        } finally {
            set({ loading: false })
        }
    },
    logout: async () => {
        set({ loading: true });
        toast.dismiss();
        try {
            await axios.post("/auth/logout")
            set({ user: null })
        } catch (error) {
            toast.error(error.response.data.message || "An error occurred during logout")
        } finally {
            set({ loading: false })
        }
    },
    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const res = await axios.get("/auth/profile")
            set({ user: res.data.user, checkingAuth: false })
        } catch (error) {
            console.log(error.message);
            set({ user: null, checkingAuth: false })
        }
    },
    refreshToken: async () => {
        if (get().checkingAuth) return;

        set({ checkingAuth: true });
        try {
            const response = await axios.post("/auth/refresh-token");
            set({ checkingAuth: false });
            return response.data;
        } catch (error) {
            set({ user: null, checkingAuth: false });
            throw error;
        }
    }
}))

let refreshPromise = null;
axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error?.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // If a refresh is already in progress, wait for it to complete
                if (refreshPromise) {
                    await refreshPromise;
                    return axios(originalRequest);
                }
                // Start a new refresh process
                refreshPromise = useUserStore.getState().refreshToken();
                await refreshPromise;
                refreshPromise = null;
                return axios(originalRequest);
            } catch (refreshError) {
                // If refresh fails, redirect to login or handle as needed
                useUserStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default useUserStore;