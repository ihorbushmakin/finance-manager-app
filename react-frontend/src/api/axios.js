import axios from "axios";


const baseURL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// For adding the token to the request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access") || sessionStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// For handling 401 errors and refreshing the token
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      (localStorage.getItem("refresh") || sessionStorage.getItem("refresh"))
    ) {
      originalRequest._retry = true;
      try {
        const refresh = localStorage.getItem("refresh") || sessionStorage.getItem("refresh");
        const res = await axios.post(`${baseURL}token/refresh/`, { refresh });
        const newAccess = res.data.access;
        localStorage.setItem("access", newAccess);
        sessionStorage.setItem("access", newAccess);
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest); // retry the original request
      } catch (err) {
        // If refresh token fails, redirect to login
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        sessionStorage.removeItem("access");
        sessionStorage.removeItem("refresh");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
