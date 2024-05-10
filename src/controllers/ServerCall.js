import axios from "axios";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

const config = {
  headers: {},
};

const ServerCall = {
  getData: async (route) => {
    return axios.get(import.meta.env.VITE_API_HOST + "/media/" + route, {
      responseType: "arraybuffer",
    });
  },
  get: async (route) => {
    config.headers["Authorization"] = `Bearer ${cookies.get("accessToken")}`;
    return await axios
      .get(import.meta.env.VITE_API_HOST + route, config)
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.assign("/");
          console.log("error", error);
        }
        throw error;
      });
  },
  post: async (route, data) => {
    config.headers["Authorization"] = `Bearer ${cookies.get("accessToken")}`;
    return await axios
      .post(import.meta.env.VITE_API_HOST + route, data, config)
      .catch((error) => {
        if (error.response.status === 401) {
          console.log("error", error);
        }
        throw error;
      });
  },
  patch: async (route, data) => {
    config.headers["Authorization"] = `Bearer ${cookies.get("accessToken")}`;
    return await axios
      .patch(import.meta.env.VITE_API_HOST + route, data, config)
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.assign("/");
          console.log("error", error);
        }
        throw error;
      });
  },
  put: async (route, data) => {
    config.headers["Authorization"] = `Bearer ${cookies.get("accessToken")}`;
    return await axios
      .put(import.meta.env.VITE_API_HOST + route, data, config)
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.assign("/");
          console.log("error", error);
        }
        throw error;
      });
  },
  delete: async (route) => {
    config.headers["Authorization"] = `Bearer ${cookies.get("accessToken")}`;
    return await axios
      .delete(import.meta.env.VITE_API_HOST + route, config)
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.assign("/");
          console.log("error", error);
        }
        throw error;
      });
  },
  postMedia: async (route, data) => {
    config.headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${cookies.get("accessToken")}`,
    };
    return await axios
      .post(import.meta.env.VITE_API_HOST + route, data, config)
      .catch((error) => {
        if (error.response.status === 401) {
          window.location.assign("/");
          console.log("error", error);
        }
        throw error;
      });
  },
};

export default ServerCall;
