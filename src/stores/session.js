import { defineStore } from "pinia";
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

export const useSessionStore = defineStore("session", {
  state: () => ({
    accessToken: null,
  }),
  actions: {
    isLoged() {
      return cookies.get("accessToken");
    },
    getUserId() {
      const usrId = cookies.get("userId");
      return usrId;
    },
    getUserNickname() {
      return cookies.get("userNickname");
    },
    getUserRole() {
      return cookies.get("userRole");
    },
    setUserData(token) {
      cookies.set("accessToken", token);
    },
    clearUserData() {
      cookies.remove("userId");
      cookies.remove("accessToken");
      cookies.remove("userNickname");
      cookies.remove("userRole");
    },
  },
});
