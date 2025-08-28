import axios from "axios";

const baseURL = "http://127.0.0.1:8000/";

const axiosInstance = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem("refresh");
            if (!refreshToken) {
                localStorage.clear();
                window.location.href = "/signin";
                return Promise.reject(error);
            }

            try {
                const res = await axios.post(`${baseURL}token/refresh/`, {
                    refresh: refreshToken,
                });
                localStorage.setItem("access", res.data.access);
                originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
                return axiosInstance(originalRequest);
            } catch (err) {
                localStorage.clear();
                window.location.href = "/signin";
                return Promise.reject(err);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
