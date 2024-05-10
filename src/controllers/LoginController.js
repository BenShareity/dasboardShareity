import ServerCall from "./ServerCall";
import json from "/assets/data/country-codes.json";
import { useSessionStore } from "@/stores/session";

const sessionStore = useSessionStore();

const LoginController = {
  login: async (email, password) => {
    try {
      const response = await ServerCall.post("/auth/login", {
        email: email,
        password: password,
      }).then((resp) => {
        sessionStore.setUserData(resp.data.access_token);
        return true;
      });
      return response;
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    sessionStore.clearUserData();
  },
};

export default LoginController;
