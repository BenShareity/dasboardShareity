import { defineStore } from "pinia";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    routes: null,
  }),
  actions: {
    // async getRoutes() {
    //   if (!this.routes) {
    //     this.routes = return
    //   }
    //   return this.routes;
    // },
  },
});
