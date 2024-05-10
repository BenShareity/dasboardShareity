import { defineStore } from "pinia";

export const useAlertStore = defineStore("alert", {
  state: () => ({
    /* Alerts */
    color: null,
    icon: null,
    title: null,
    text: null,
    status: false,
  }),
  actions: {
    createAlert(body) {
      this.color = body.color || "success" || "#dc2626";
      this.icon = body.icon || "$success" || "x-icon-";
      this.title = body.title || "";
      this.text = body.text || "";
      this.status = true;
      if (body.timeout !== 0) {
        this.destroyAlert(body.timeout || 5000);
      }
    },
    destroyAlert(ms) {
      setTimeout(() => {
        this.status = false;
      }, ms);
    },
  },
});
