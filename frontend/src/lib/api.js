import axios from "axios";

const api = axios.create({
  baseURL: `${API_BASE}/api`,
});

// ACCESS TOKEN QO‘SHISH
api.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");

  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  return config;
});

// TOKEN REFRESH
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // access eskirgan bo‘lsa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        // refresh yuborish
        const response = await axios.post(`${API_BASE}/api/accounts/refresh/`, {
          refresh,
        });

        const newAccess = response.data.access;

        // yangi access saqlash
        localStorage.setItem("access", newAccess);

        // requestni qayta yuborish
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return api(originalRequest);
      } catch (refreshError) {
        // refresh ham eskirgan bo‘lsa
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("user");

        window.location.href = "/login";

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
