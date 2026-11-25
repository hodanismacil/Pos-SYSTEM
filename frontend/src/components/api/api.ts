import axios from "axios";





const api = axios.create({
  baseURL: "https://hodan-pos-system.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");

    console.log("Token-ka baxaaya waa:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;